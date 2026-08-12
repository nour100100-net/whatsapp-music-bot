import path from 'path';
import fs from 'fs';
import { MessageMedia, Message } from 'whatsapp-web.js';
import Downloader from '../services/download';
import Searcher from '../services/search';
import text from '../language';
import { LANGUAGE } from '../config';

export default {
  run: async (message: Message, keyword: string): Promise<Message> => {
    if (!keyword) {
      return message.reply(`${text[LANGUAGE].ERROR} Use !play <song name>`);
    }

    const downloader = new Downloader();
    const searcher = new Searcher();

    try {
      const { title, videoId, url } = await searcher.handle(keyword);

      await message.reply(`${text[LANGUAGE].FOUNDED} "${title}"`);
      await message.reply(text[LANGUAGE].DOWNLOAD_STARTED);

      const music = await downloader.handle(videoId, url);

      console.log('[DEBUG] Download completed:', music);

      const musicPath = path.resolve(music);

      if (!fs.existsSync(musicPath)) {
        throw new Error(`Downloaded file not found: ${musicPath}`);
      }

      console.log('[DEBUG] File exists:', musicPath);

      // اختبار إرسال رسالة نصية أولًا
      await message.reply('تم التحميل، جاري إرسال الصوت 🎵');

      console.log('[DEBUG] Text message sent, now preparing audio...');

      const media = MessageMedia.fromFilePath(musicPath);

      console.log('[DEBUG] Sending audio...');

      await message.reply(media);

      console.log('[DEBUG] Audio sent successfully');

      return message;
    } catch (error) {
      console.error('[ERROR] PLAY COMMAND:', error);
      return message.reply(text[LANGUAGE].ERROR);
    }
  },

  help: text[LANGUAGE].HELP_PLAY,
};