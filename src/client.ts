import fs from 'fs';
import path from 'path';
import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import QRCode from 'qrcode';
import text from './language';
import { LANGUAGE } from './config';

const sessionRoot = path.resolve(process.cwd(), 'whatsapp-session');
const authBasePath = path.join(sessionRoot, 'auth-data');
const browserSessionPath = path.join(authBasePath, 'session');

const staleLockFiles = [
  'lockfile',
  'DevToolsActivePort',
  'SingletonLock',
  'SingletonSocket',
];

let authPath = authBasePath;
let fallbackRequired = false;

for (const fileName of staleLockFiles) {
  const filePath = path.join(browserSessionPath, fileName);

  if (fs.existsSync(filePath)) {
    console.warn(`Detected existing browser lock file: ${fileName}`);

    try {
      fs.rmSync(filePath, { force: true });
      console.log(`Removed stale browser lock file: ${fileName}`);
    } catch (err) {
      console.warn(`Could not remove stale lock file ${fileName}:`, err);
      fallbackRequired = true;
    }
  }
}

if (fallbackRequired) {
  authPath = path.join(sessionRoot, `auth-data-${Date.now()}`);
  fs.mkdirSync(authPath, { recursive: true });
  console.log(`Using fallback auth path because session appears occupied: ${authPath}`);
} else {
  fs.mkdirSync(browserSessionPath, { recursive: true });
}

const client = new Client({
  puppeteer: {
    headless: true,
    args: ['--no-sandbox'],
  },
  authStrategy: new LocalAuth({
    dataPath: authPath,
  }),
});

client.on('qr', async qr => {
  console.log('\n========== WHATSAPP QR ==========\n');

  // QR عادي كنسخة احتياطية
  qrcode.generate(qr, { small: true });

  // رابط QR كصورة
  const qrImage = await QRCode.toDataURL(qr);
  console.log('\nQR IMAGE:\n');
  console.log(qrImage);

  console.log('\n=================================\n');
});

client.on('ready', async () => {
  console.log(text[LANGUAGE].CONNECTED);
});

export default client;