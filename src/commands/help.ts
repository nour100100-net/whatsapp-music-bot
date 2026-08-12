import { Message } from 'whatsapp-web.js';
import text from '../language';
import { LANGUAGE, PREFIX } from '../config';
import commands from '.';

export default {
  run: async (message: Message, keyword: string): Promise<Message> => {
  console.log('🟢 HELP COMMAND STARTED');
  console.log('🔎 HELP KEYWORD:', keyword);
  console.log('🔎 AVAILABLE COMMANDS:', Object.keys(commands));

  try {
    if (!keyword) {
      console.log('📤 Sending help list');

      return await message.reply(
        `${text[LANGUAGE].AVAILABLE_COMMANDS}: ${Object.keys(commands).join(', ')}`
      );
    }

    const commandKey = `${PREFIX}${keyword}` as keyof typeof commands;
    console.log('🔎 HELP COMMAND KEY:', commandKey);

    const command = commands[commandKey];

    if (!command) {
      console.log('❌ HELP COMMAND NOT FOUND');
      return await message.reply(`${text[LANGUAGE].ERROR}`);
    }

    return await message.reply(command.help);
  } catch (error) {
    console.error('❌ HELP ERROR:', error);
    return await message.reply(`${text[LANGUAGE].ERROR}`);
  }
},
  help: text[LANGUAGE].HELP_HELP,
};
