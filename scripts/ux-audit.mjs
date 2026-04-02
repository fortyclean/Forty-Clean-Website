import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseUrl = 'http://localhost:5174';
const outDir = path.resolve('review-screenshots');

const routes = [
  { name: 'home', path: '/' },
  { name: 'booking', path: '/booking' },
  { name: 'admin-leads', path: '/admin-leads' },
  { name: 'blog', path: '/blog' },
  { name: 'cleaning', path: '/cleaning' },
  { name: 'pest', path: '/pest' },
  { name: 'offers', path: '/offers' },
];

async function ensureDir() {
  await fs.mkdir(outDir, { recursive: true });
}

async function safeClick(page, selector) {
  const el = page.locator(selector).first();
  if (await el.count()) {
    await el.click({ timeout: 2000 }).catch(() => {});
  }
}

async function safeType(page, selector, value) {
  const el = page.locator(selector).first();
  if (await el.count()) {
    await el.fill(value).catch(() => {});
  }
}

async function captureRoute(context, variant, routeName, routePath) {
  const page = await context.newPage();
  const fullUrl = `${baseUrl}${routePath}`;
  await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(1200);
  await page.screenshot({
    path: path.join(outDir, `${variant}-${routeName}.png`),
    fullPage: true,
  });
  await page.close();
}

async function captureInteractionsDesktop(context) {
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(1200);

  // Attempt order tracking interaction.
  await safeType(page, 'input[type="tel"]', '12345678');
  await safeClick(page, 'button[type="submit"]');
  await page.waitForTimeout(1400);
  await page.screenshot({
    path: path.join(outDir, 'desktop-home-order-tracking-after-search.png'),
    fullPage: true,
  });

  // Attempt open cart if visible.
  await safeClick(page, 'button:has(svg)');
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(outDir, 'desktop-home-after-primary-click.png'),
    fullPage: true,
  });

  await page.close();
}

async function main() {
  await ensureDir();
  const browser = await chromium.launch({ headless: true });

  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  for (const route of routes) {
    await captureRoute(desktop, 'desktop', route.name, route.path);
  }
  await captureInteractionsDesktop(desktop);
  await desktop.close();

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  for (const route of routes) {
    await captureRoute(mobile, 'mobile', route.name, route.path);
  }
  await mobile.close();

  await browser.close();
  console.log(`Screenshots saved to: ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
