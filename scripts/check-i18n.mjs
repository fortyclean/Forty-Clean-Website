import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const arPath = path.join(root, 'src', 'locales', 'ar.json');
const enPath = path.join(root, 'src', 'locales', 'en.json');

const ar = JSON.parse(fs.readFileSync(arPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const flatten = (value, prefix = '', out = {}) => {
  for (const [key, child] of Object.entries(value)) {
    const nextKey = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === 'object' && !Array.isArray(child)) {
      flatten(child, nextKey, out);
    } else {
      out[nextKey] = true;
    }
  }
  return out;
};

const arKeys = flatten(ar);
const enKeys = flatten(en);

const missingInAr = Object.keys(enKeys).filter((key) => !arKeys[key]).sort();
const missingInEn = Object.keys(arKeys).filter((key) => !enKeys[key]).sort();

if (missingInAr.length || missingInEn.length) {
  if (missingInAr.length) {
    console.error('Missing in ar.json:');
    for (const key of missingInAr) {
      console.error(`- ${key}`);
    }
  }

  if (missingInEn.length) {
    console.error('Missing in en.json:');
    for (const key of missingInEn) {
      console.error(`- ${key}`);
    }
  }

  process.exit(1);
}

console.log('i18n keys are in sync.');
