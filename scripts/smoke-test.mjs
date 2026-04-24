import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import process from 'node:process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';
import admin from 'firebase-admin';

const HOST = '127.0.0.1';
const PORT = 4173;
const BASE_URL = `http://${HOST}:${PORT}`;
const STARTUP_TIMEOUT_MS = 30_000;
const ADMIN_SERVICE_ACCOUNT_PATH = 'forty-clean-firebase-adminsdk-fbsvc-aa615da469.json';
const ADMIN_UID = process.env.TEST_ADMIN_UID || 'pS4Ba12vnzfA0LhMN5XcPJBwAwz2';

const server = spawn('cmd.exe', ['/d', '/s', '/c', `npm.cmd run dev -- --host ${HOST} --port ${PORT}`], {
  cwd: process.cwd(),
  stdio: ['ignore', 'pipe', 'pipe'],
  windowsHide: true,
});

let serverOutput = '';

server.stdout.on('data', (chunk) => {
  serverOutput += chunk.toString();
});

server.stderr.on('data', (chunk) => {
  serverOutput += chunk.toString();
});

const waitForServer = async () => {
  const startedAt = Date.now();

  while (Date.now() - startedAt < STARTUP_TIMEOUT_MS) {
    try {
      const response = await fetch(BASE_URL, { redirect: 'manual' });
      if (response.ok || response.status === 404) {
        return;
      }
    } catch {
      await delay(500);
      continue;
    }

    await delay(500);
  }

  throw new Error(`Dev server did not become ready in time.\n${serverOutput}`);
};

const cleanup = async () => {
  if (!server.killed) {
    spawnSync('taskkill', ['/pid', String(server.pid), '/t', '/f'], { stdio: 'ignore' });
    await delay(500);
  }
};

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const fetchRoute = async (path) => {
  const response = await fetch(`${BASE_URL}${path}`, { redirect: 'manual' });
  const html = await response.text();
  return { response, html };
};

const openPage = async (browser, { path, language, theme, viewport = { width: 1440, height: 900 } }) => {
  const page = await browser.newPage({ viewport });
  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', (error) => {
    pageErrors.push(String(error));
  });

  await page.addInitScript(({ nextLanguage, nextTheme }) => {
    window.localStorage.setItem('i18nextLng', nextLanguage);
    if (nextTheme) {
      window.localStorage.setItem('theme', nextTheme);
    } else {
      window.localStorage.removeItem('theme');
    }
  }, { nextLanguage: language, nextTheme: theme });

  await page.goto(`${BASE_URL}${path}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);

  return { page, consoleErrors, pageErrors };
};

const assertNoRuntimeErrors = (label, consoleErrors, pageErrors) => {
  assert(pageErrors.length === 0, `${label} emitted page errors:\n${pageErrors.join('\n')}`);
  assert(consoleErrors.length === 0, `${label} emitted console errors:\n${consoleErrors.join('\n')}`);
};

const resolveAdminCustomToken = async () => {
  if (!fs.existsSync(ADMIN_SERVICE_ACCOUNT_PATH)) {
    return null;
  }

  if (admin.apps.length === 0) {
    const serviceAccount = JSON.parse(fs.readFileSync(ADMIN_SERVICE_ACCOUNT_PATH, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  return admin.auth().createCustomToken(ADMIN_UID, { admin: true, role: 'admin' });
};

try {
  await waitForServer();

  const home = await fetchRoute('/');
  const booking = await fetchRoute('/booking');
  const pricing = await fetchRoute('/pricing');
  const blog = await fetchRoute('/blog');
  const adminLegacy = await fetchRoute('/admin-leads');

  assert(home.response.ok, 'Home route should respond successfully.');
  assert(booking.response.ok, 'Booking route should respond successfully.');
  assert(pricing.response.ok, 'Pricing route should respond successfully.');
  assert(blog.response.ok, 'Blog route should respond successfully.');
  assert(adminLegacy.response.ok, 'Legacy admin route should respond successfully.');
  assert(home.html.includes('<div id="root"></div>'), 'Home HTML should include the app root.');
  assert(booking.html.includes('<div id="root"></div>'), 'Booking HTML should include the app root.');
  assert(pricing.html.includes('<div id="root"></div>'), 'Pricing HTML should include the app root.');
  assert(blog.html.includes('<div id="root"></div>'), 'Blog HTML should include the app root.');

  const browser = await chromium.launch({ headless: true });

  const arabicHome = await openPage(browser, { path: '/', language: 'ar', theme: 'light' });
  assert((await arabicHome.page.title()).length > 0, 'Arabic home page should have a title.');
  assert(((await arabicHome.page.locator('#root').innerHTML()).trim().length) > 0, 'Arabic home page should render UI.');
  assert(await arabicHome.page.evaluate(() => document.documentElement.lang === 'ar'), 'Arabic home page should set html lang="ar".');
  assert(await arabicHome.page.evaluate(() => document.documentElement.dir === 'rtl'), 'Arabic home page should set rtl direction.');
  assertNoRuntimeErrors('Arabic home page', arabicHome.consoleErrors, arabicHome.pageErrors);
  await arabicHome.page.close();

  const defaultThemeHome = await openPage(browser, { path: '/', language: 'ar', theme: null });
  assert(
    !(await defaultThemeHome.page.evaluate(() => document.documentElement.classList.contains('dark'))),
    'Home page should default to light theme when no stored theme exists.'
  );
  assertNoRuntimeErrors('Default theme home page', defaultThemeHome.consoleErrors, defaultThemeHome.pageErrors);
  await defaultThemeHome.page.close();

  const darkEnglishHome = await openPage(browser, { path: '/', language: 'en', theme: 'dark' });
  const englishBodyText = await darkEnglishHome.page.locator('body').innerText();
  assert(
    englishBodyText.includes('Home') ||
      englishBodyText.includes('Book Now') ||
      englishBodyText.includes('Forty') ||
      englishBodyText.includes('Cleaning') ||
      englishBodyText.includes('WhatsApp') ||
      englishBodyText.includes('quote'),
    'English home page should render English copy.'
  );
  assert(await darkEnglishHome.page.evaluate(() => document.documentElement.classList.contains('dark')), 'Dark theme should be applied on home page.');
  assert(await darkEnglishHome.page.evaluate(() => document.documentElement.lang === 'en'), 'English home page should set html lang="en".');
  assertNoRuntimeErrors('Dark English home page', darkEnglishHome.consoleErrors, darkEnglishHome.pageErrors);
  await darkEnglishHome.page.close();

  const pricingPage = await openPage(browser, { path: '/pricing', language: 'ar', theme: 'light' });
  const pricingText = await pricingPage.page.locator('body').innerText();
  assert(
    pricingText.includes('احسب السعر') ||
      pricingText.includes('السعر التقديري') ||
      pricingText.includes('حاسبة') ||
      pricingText.includes('Estimate'),
    'Pricing page should render calculator-related copy.'
  );
  assertNoRuntimeErrors('Pricing page', pricingPage.consoleErrors, pricingPage.pageErrors);
  await pricingPage.page.close();

  const bookingFlow = await openPage(browser, { path: '/booking', language: 'en', theme: 'dark' });
  const bookingRoot = (await bookingFlow.page.locator('#root').innerHTML()).trim();
  assert(bookingRoot.length > 0, 'Booking page should render UI.');
  await bookingFlow.page.locator('button').filter({ hasText: 'Full Cleaning' }).first().click();
  await bookingFlow.page.waitForTimeout(500);

  const quickDateButtons = bookingFlow.page.locator('button').filter({ hasText: /\d/ });
  if (await quickDateButtons.count()) {
    await quickDateButtons.nth(0).click();
  } else {
    const dateInput = bookingFlow.page.locator('input[type="date"]').first();
    const minimumDate = await dateInput.getAttribute('min');
    assert(Boolean(minimumDate), 'Booking date input should expose a valid minimum date.');
    await dateInput.fill(minimumDate);
  }
  await bookingFlow.page.waitForTimeout(300);

  await bookingFlow.page.locator('button').filter({ hasText: '09:00 AM' }).first().click();
  await bookingFlow.page.waitForTimeout(300);
  const confirmAppointmentButton = bookingFlow.page.locator('button').filter({ hasText: 'Confirm Appointment' }).first();
  await bookingFlow.page.waitForFunction(
    () => {
      const button = Array.from(document.querySelectorAll('button')).find((element) =>
        element.textContent?.includes('Confirm Appointment')
      );
      return button ? !button.hasAttribute('disabled') : false;
    },
    undefined,
    { timeout: 5000 }
  );
  await confirmAppointmentButton.click();
  await bookingFlow.page.waitForTimeout(500);

  await bookingFlow.page.locator('input[placeholder="Example: Ahmed Mohamed"]').fill('Smoke Test');
  await bookingFlow.page.locator('input[placeholder="5xxxxxxx"]').fill('51234567');
  await bookingFlow.page.locator('textarea[placeholder^="Area, Block"]').fill('Salmiya, Block 1, Street 1, House 10');

  const finalConfirmButton = bookingFlow.page.locator('button').filter({ hasText: 'Final Booking Confirmation' }).first();
  assert(!(await finalConfirmButton.isDisabled()), 'Final booking confirmation button should be enabled after completing the form.');
  assertNoRuntimeErrors('Booking flow', bookingFlow.consoleErrors, bookingFlow.pageErrors);
  await bookingFlow.page.close();

  const adminCustomToken = await resolveAdminCustomToken();
  if (adminCustomToken) {
    const adminPage = await openPage(browser, { path: '/admin', language: 'ar', theme: 'dark' });
    await adminPage.page.evaluate(async (customToken) => {
      const { signInWithFirebaseCustomToken } = await import('/src/lib/firebase.ts');
      await signInWithFirebaseCustomToken(customToken);
    }, adminCustomToken);
    await adminPage.page.reload({ waitUntil: 'domcontentloaded' });
    await adminPage.page.waitForTimeout(2500);

    const adminText = await adminPage.page.locator('body').innerText();
    assert(adminText.includes('لوحة الإدارة'), 'Admin page should render the admin heading.');
    assert(adminText.includes('إضافة عميل جديد'), 'Admin tools should show the add-customer form.');
    assert(adminText.includes('العملاء'), 'Admin tools should show the customers section.');
    assertNoRuntimeErrors('Admin page', adminPage.consoleErrors, adminPage.pageErrors);
    await adminPage.page.close();
  }

  await browser.close();
  await cleanup();
  console.log('Smoke tests passed.');
} catch (error) {
  await cleanup();
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
