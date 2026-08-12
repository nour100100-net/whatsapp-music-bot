import client from './client';
import commands from './commands';
import { PREFIX } from './config';

const allCommands = ['play', 'v', 'help'];

client.on('message', async message => {
  console.log('📩 MESSAGE RECEIVED:', message.body);

  const body = message.body?.trim();
  if (!body || !body.startsWith(PREFIX)) return;

  const [command, ...rest] = body.split(' ');
  const content = rest.join(' ');

  const commandName = command.substring(1);

  if (!allCommands.includes(commandName)) {
    console.log('❌ Unknown command:', commandName);
    return;
  }

  console.log('▶️ Running command:', commandName);

  await commands[commandName].run(message, content);
});

client.initialize();