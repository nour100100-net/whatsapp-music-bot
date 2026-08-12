import path from 'path';
import { MessageMedia, Message } from 'whatsapp-web.js';
import client from '../client';
import Downloader from '../services/download';
import Searcher from '../services/search';
import text from '../language';
import { LANGUAGE, PREFIX } from '../config';

export default {
  run: async (message: Message, keyword: string): Promise<Message | void> => {
    if (!keyword) {
      return message.reply(`${text[LANGUAGE].ERROR} Use ${PREFIX}v <video name>`);
    }

    const downloader = new Downloader();
    const searcher = new Searcher();

    try {
      const { title, videoId, url } = await searcher.handle(keyword);
      await message.reply(`${text[LANGUAGE].FOUNDED} "${title}"`);
      await message.reply(text[LANGUAGE].DOWNLOAD_STARTED);

      const videoPath = await downloader.handle(videoId, url, 'mp4');
      const absolutePath = path.resolve(videoPath);
      
      console.log(`[DEBUG] Loading media from: ${absolutePath}`);
      const media = MessageMedia.fromFilePath(absolutePath);
      
      // Force MIME type to video/mp4 if it wasn't detected correctly
      if (!media.mimetype || media.mimetype === 'application/octet-stream') {
        media.mimetype = 'video/mp4';
      }

      console.log(`[DEBUG] Sending video... MIME: ${media.mimetype}, Size: ${media.data.length} bytes`);
      
      const chat = await message.getChat();
      return await client.sendMessage(chat.id._serialized, media, {
        sendMediaAsDocument: false, // Ensure it's sent as a playable video
      });
    } catch (error) {
      console.error('[ERROR] Failed to send video:', error);
      return message.reply(text[LANGUAGE].ERROR);
    }
  },
  help: text[LANGUAGE].HELP_VIDEO,
};
