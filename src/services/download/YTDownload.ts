import fs from 'fs';
import path from 'path';
import ytdlp from 'yt-dlp-exec';
import { DOWNLOAD_PATH } from '../../config';

const ffmpegPath = require('ffmpeg-static');

export default class YTDownload {
  public async download(
    videoId: string,
    videoUrl: string,
    format: 'mp3' | 'mp4' = 'mp3'
  ): Promise<string> {

    const extension = format === 'mp3' ? 'mp3' : 'mp4';

    const finalPath = path.join(
      DOWNLOAD_PATH,
      `${videoId}.${extension}`
    );

    if (!fs.existsSync(DOWNLOAD_PATH)) {
      fs.mkdirSync(DOWNLOAD_PATH, {
        recursive: true
      });
    }

    const normalizedVideoUrl =
      this.normalizeVideoUrl(videoUrl, videoId);

    console.log(
      `[DEBUG] Starting download for videoId: ${videoId} in format: ${format}`
    );

    console.log(
      `[DEBUG] Normalized URL: ${normalizedVideoUrl}`
    );

    try {
      const options: any = {
        output: path.join(
          DOWNLOAD_PATH,
          `${videoId}.%(ext)s`
        ),

        ffmpegLocation: ffmpegPath,

        noPlaylist: true,

        preferFreeFormats: true,

        noCheckCertificate: true,

        // تحسين التعامل مع YouTube
        extractorArgs: 'youtube:player_client=android,web',

        // محاولة تقليل مشاكل Railway
        retries: 10,
        fragmentRetries: 10,
      };

      if (format === 'mp3') {
        options.extractAudio = true;
        options.audioFormat = 'mp3';
        options.audioQuality = 0;
      } else {
        options.format =
          'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best';

        options.mergeOutputFormat = 'mp4';
      }

      await ytdlp(
        normalizedVideoUrl,
        options
      );

      if (!fs.existsSync(finalPath)) {
        const files = fs.readdirSync(DOWNLOAD_PATH);

        console.error(
          `[ERROR] Expected file ${finalPath} not found. Current files:`,
          files
        );

        throw new Error(
          `yt-dlp finished but ${extension} file is missing at ${finalPath}`
        );
      }

      console.log(
        `[SUCCESS] Download completed: ${finalPath}`
      );

      return finalPath;

    } catch (err) {

      console.error('[YT-DLP ERROR]', err);

      throw new Error(
        `Failed to download video ${videoId}: ${
          err instanceof Error
            ? err.message
            : String(err)
        }`
      );
    }
  }

  private normalizeVideoUrl(
    videoUrl: string,
    videoId: string
  ): string {

    if (!videoUrl || typeof videoUrl !== 'string') {
      return `https://www.youtube.com/watch?v=${videoId}`;
    }

    try {
      const parsed = new URL(videoUrl);

      const hostname = parsed.hostname
        .replace(/^www\./, '')
        .toLowerCase();

      // رابط مختصر youtu.be
      if (hostname === 'youtu.be') {

        const id = parsed.pathname.slice(1);

        return `https://www.youtube.com/watch?v=${id}`;
      }

      // روابط YouTube المختلفة
      if (
        hostname === 'youtube.com' ||
        hostname === 'm.youtube.com' ||
        hostname === 'music.youtube.com'
      ) {

        parsed.hostname = 'www.youtube.com';

        return parsed.toString();
      }

    } catch (_err) {
      console.log(
        '[DEBUG] Invalid URL received, using fallback'
      );
    }

    // لو الفيديو ID فقط
    if (/^[A-Za-z0-9_-]{11}$/.test(videoUrl)) {
      return `https://www.youtube.com/watch?v=${videoUrl}`;
    }

    // fallback
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
}