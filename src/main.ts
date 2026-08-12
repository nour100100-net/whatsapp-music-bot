import client from './client';
import commands from './commands';
import { PREFIX } from './config';

const allCommands = ['play', 'v', 'help'];

client.on('message', async message => {
  console.log('📩 MESSAGE EVENT:', message.body);
});

client.on('message_create', async message => {
  console.log('📩 MESSAGE_CREATE EVENT:', message.body);

  const body = message.body?.trim();
  if (!body || !body.startsWith(PREFIX)) return;

  const [command, ...rest] = body.split(' ');
  const content = rest.join(' ');

  const commandKey = command as keyof typeof commands;
  const selectedCommand = commands[commandKey];

  console.log('🔎 COMMAND:', command);
  console.log('🔎 COMMAND KEY:', commandKey);

  if (!selectedCommand) {
    console.log('❌ Unknown command:', command);
    return;
  }

  console.log('▶️ Running command:', command);

  try {
    await selectedCommand.run(message, content);
    console.log('✅ Command finished:', command);
  } catch (error) {
    console.error('❌ Command error:', error);
  }
});

client.initialize();