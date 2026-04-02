import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import admin from 'firebase-admin';

const REQUIRED_ENV_KEYS = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
];

const parseEnvFile = (content) => {
  const entries = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    entries[key] = value;
  }

  return entries;
};

const loadLocalEnv = () => {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    return;
  }

  const fileEntries = parseEnvFile(fs.readFileSync(envPath, 'utf8'));
  for (const [key, value] of Object.entries(fileEntries)) {
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
};

loadLocalEnv();

const uid = process.argv[2]?.trim();

if (!uid) {
  console.error('Usage: node scripts/set-admin-claims.mjs <USER_UID>');
  process.exit(1);
}

const missingKeys = REQUIRED_ENV_KEYS.filter((key) => !process.env[key]?.trim());
if (missingKeys.length > 0) {
  console.error(`Missing required env vars: ${missingKeys.join(', ')}`);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

await admin.auth().setCustomUserClaims(uid, {
  admin: true,
  role: 'admin',
});

console.log(`Admin claims set successfully for UID: ${uid}`);
