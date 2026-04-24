import { copyFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = resolve(__dirname, '../public/.htaccess');
const dest = resolve(__dirname, '../dist/.htaccess');

copyFileSync(src, dest);
console.log('✅ .htaccess copied: public/.htaccess → dist/.htaccess');
