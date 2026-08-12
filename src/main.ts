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

  const commandName = command.substring(PREFIX.length);

  console.log('🔎 COMMAND:', commandName);

  if (!allCommands.includes(commandName)) {
    console.log('❌ Unknown command:', commandName);
    return;
  }

  console.log('▶️ Running command:', commandName);

  try {
    await commands[`${PREFIX}${commandName}`].run(message, content);
    console.log('✅ Command finished:', commandName);
  } catch (error) {
    console.error('❌ Command error:', error);
  }
});

client.initialize();