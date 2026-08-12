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

  console.log(
    `Using fallback auth path because session appears occupied: ${authPath}`,
  );
} else {
  fs.mkdirSync(browserSessionPath, { recursive: true });
}

const client = new Client({
  puppeteer: {
    headless: true,
    protocolTimeout: 120000,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-extensions',
      '--disable-background-networking',
    ],
  },

  authStrategy: new LocalAuth({
    dataPath: authPath,
  }),
});

client.on('qr', async qr => {
  console.log('\n========== WHATSAPP QR ==========\n');

  qrcode.generate(qr, { small: true });

  try {
    const qrImage = await QRCode.toDataURL(qr);

    console.log('\nQR IMAGE:\n');
    console.log(qrImage);
  } catch (error) {
    console.error('❌ QR generation error:', error);
  }

  console.log('\n=================================\n');
});

client.on('authenticated', () => {
  console.log('🔐 WhatsApp authenticated');
});

client.on('ready', () => {
  console.log('✅ WhatsApp READY - Successfully connected!');
});

client.on('change_state', state => {
  console.log('🔄 WhatsApp state:', state);
});

client.on('disconnected', reason => {
  console.error('❌ WhatsApp DISCONNECTED:', reason);
});

client.on('auth_failure', message => {
  console.error('❌ WhatsApp AUTH FAILURE:', message);
});

setInterval(async () => {
  try {
    const state = await client.getState();

    console.log('💓 WhatsApp health:', state);

    if (state !== 'CONNECTED') {
      console.warn('⚠️ WhatsApp is not connected:', state);
    }
  } catch (error) {
    console.error('❌ WhatsApp health check failed:', error);
  }
}, 30000);

export default client;