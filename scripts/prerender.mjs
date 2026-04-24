import { preview } from 'vite';
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

const routes = [
  '/',
  '/cleaning',
  '/pest',
  '/offers',
  '/pricing',
  '/plans',
  '/blog',
  '/booking'
];

async function run() {
  console.log('🚀 Starting Vite preview server for prerendering...');
  const server = await preview({
    preview: { port: 4173, host: true }
  });
  const baseUrl = server.resolvedUrls.local[0].replace(/\/$/, '');

  console.log('🌐 Launching Chromium browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  for (const route of routes) {
    console.log(`⏳ Prerendering route: ${route} ...`);
    const targetUrl = `${baseUrl}${route}`;
    console.log(`Target URL: ${targetUrl}`);
    
    try {
      await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
      console.log('Navigation complete');
    } catch (e) {
      console.error('Navigation error:', e);
    }
    
    console.log('Waiting for main selector...');
    // Wait for the main content to be rendered by React
    await page.waitForSelector('main', { timeout: 15000 }).catch((e) => {
      console.error('Main selector not found:', e.message);
    });
    
    console.log('Waiting for 3 seconds...');
    // Additional wait to ensure dynamic data (e.g. translation, SEO tags) is injected
    await page.waitForTimeout(3000);

    console.log('Getting HTML...');
    const html = await page.content();

    const routeDir = path.join(distDir, route);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    const filePath = path.join(routeDir, 'index.html');
    fs.writeFileSync(filePath, html);
    
    console.log(`✅ Saved prerendered HTML -> ${filePath}`);
  }

  console.log('🛑 Closing browser and server...');
  await browser.close();
  server.httpServer.close();
  console.log('🎉 Prerendering completed successfully!');
  process.exit(0);
}

run().catch((e) => {
  console.error('❌ Prerendering failed:', e);
  process.exit(1);
});
