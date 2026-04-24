import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.fortyclean.com';
const TODAY = new Date().toISOString().split('T')[0];

const pages = [
  {
    path: '/',
    priority: '1.0',
    changefreq: 'monthly',
    images: [
      { loc: '/images/home-cleaning-kuwait.webp', title: 'Home Cleaning Kuwait - Forty' },
      { loc: '/images/pest-control-kuwait.webp', title: 'Pest Control Kuwait - Forty' },
    ],
  },
  {
    path: '/cleaning',
    priority: '0.8',
    changefreq: 'monthly',
    images: [
      { loc: '/images/professional-cleaning-kuwait.webp', title: 'Professional Cleaning Kuwait' },
      { loc: '/images/office-cleaning-service.webp', title: 'Office Cleaning Service Kuwait' },
      { loc: '/images/glass-cleaning-kuwait.webp', title: 'Glass Cleaning Service' },
    ],
  },
  {
    path: '/pest',
    priority: '0.8',
    changefreq: 'monthly',
    images: [
      { loc: '/images/pest-extermination-service.webp', title: 'Pest Extermination Service Kuwait' },
      { loc: '/images/pest-control-kuwait.webp', title: 'Pest Control Services' },
      { loc: '/images/pest-control-services-kuwait.webp', title: 'Specialized Pest Control' },
    ],
  },
  { path: '/offers', priority: '0.7', changefreq: 'monthly' },
  { path: '/pricing', priority: '0.7', changefreq: 'monthly' },
  { path: '/blog', priority: '0.6', changefreq: 'weekly' },
  { path: '/booking', priority: '0.9', changefreq: 'monthly' },
  { path: '/plans', priority: '0.8', changefreq: 'monthly' },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages
  .map(
    (page) => `  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${
  page.images
    ? page.images
        .map(
          (img) => `    <image:image>
      <image:loc>${BASE_URL}${img.loc}</image:loc>
      <image:title>${img.title}</image:title>
    </image:image>`
        )
        .join('\n')
    : ''
}  </url>`
  )
  .join('\n')}
</urlset>`;

const outputPath = path.resolve('public', 'sitemap.xml');
fs.writeFileSync(outputPath, sitemap);

console.log(`✅ Sitemap generated successfully at ${outputPath}`);
