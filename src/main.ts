import client from './client';
import commands from './commands';
import { PREFIX } from './config';

const allCommands = ["play", "v", "help"];

client.initialize();

client.on('message_create', async message => {
  const body = message.body?.trim();
  if (!body || !body.startsWith(PREFIX)) return;

  const [command, ...rest] = body.split(' ');
  const content = rest.join(' ');

  if (!allCommands.includes(command.substring(1))) return;

  await commands[command].run(message, content);
});
