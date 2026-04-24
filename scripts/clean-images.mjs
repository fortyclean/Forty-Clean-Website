/**
 * Deletes numbered image files (e.g. 2776853.jpg) from public/images/
 * that are not referenced anywhere in the source code.
 * Safe to run — only deletes files matching /^\d+\.(jpg|png|webp)$/ pattern.
 */
import { readdirSync, unlinkSync, statSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagesDir = resolve(__dirname, '../public/images');

const files = readdirSync(imagesDir);
const numbered = files.filter(f => /^\d+\.(jpg|png|webp)$/.test(f));

let totalBytes = 0;
let count = 0;

for (const file of numbered) {
  const fullPath = resolve(imagesDir, file);
  const size = statSync(fullPath).size;
  unlinkSync(fullPath);
  totalBytes += size;
  count++;
  console.log(`🗑  Deleted: ${file} (${(size / 1024).toFixed(0)} KB)`);
}

const totalMB = (totalBytes / 1024 / 1024).toFixed(2);
console.log(`\n✅ Removed ${count} files — freed ${totalMB} MB`);
