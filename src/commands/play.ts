import path from 'path';
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
      const media = MessageMedia.fromFilePath(path.resolve(music));
      return message.reply(media);
    } catch (error) {
      console.error(error);
      return message.reply(text[LANGUAGE].ERROR);
    }
  },
  help: text[LANGUAGE].HELP_PLAY,
};
