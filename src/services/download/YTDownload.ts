import fs from 'fs';
import path from 'path';
import ytdlp from 'yt-dlp-exec';
import { DOWNLOAD_PATH } from '../../config';

const ffmpegPath = require('ffmpeg-static');

export default class YTDownload {
  public async download(videoId: string, videoUrl: string, format: 'mp3' | 'mp4' = 'mp3'): Promise<string> {
    const extension = format === 'mp3' ? 'mp3' : 'mp4';
    const finalPath = path.join(DOWNLOAD_PATH, `${videoId}.${extension}`);

    if (!fs.existsSync(DOWNLOAD_PATH)) {
      fs.mkdirSync(DOWNLOAD_PATH, { recursive: true });
    }

    const normalizedVideoUrl = this.normalizeVideoUrl(videoUrl, videoId);
    console.log(`[DEBUG] Starting download for videoId: ${videoId} in format: ${format}`);
    console.log(`[DEBUG] Normalized URL: ${normalizedVideoUrl}`);
    console.log(`[DEBUG] Final path: ${finalPath}`);

    try {
      const options: any = {
        output: path.join(DOWNLOAD_PATH, `${videoId}.%(ext)s`),
        ffmpegLocation: ffmpegPath,
        noPlaylist: true,
        preferFreeFormats: true,
        noCheckCertificate: true,
      };

      if (format === 'mp3') {
        options.extractAudio = true;
        options.audioFormat = 'mp3';
        options.audioQuality = 0;
      } else {
        options.format = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best';
        options.mergeOutputFormat = 'mp4';
      }

      await ytdlp(normalizedVideoUrl, options);

      if (!fs.existsSync(finalPath)) {
        // Log all files in download path to help debug if it was named differently
        const files = fs.readdirSync(DOWNLOAD_PATH);
        console.error(`[ERROR] Expected file ${finalPath} not found. Current files:`, files);
        throw new Error(`yt-dlp finished but ${extension} file is missing at ${finalPath}`);
      }

      console.log(`[SUCCESS] Download completed: ${finalPath}`);
      return finalPath;
    } catch (err) {
      throw new Error(`Failed to download video ${videoId}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  private normalizeVideoUrl(videoUrl: string, videoId: string): string {
    if (!videoUrl || typeof videoUrl !== 'string') {
      return `https://www.youtube.com/watch?v=${videoId}`;
    }

    try {
      const parsed = new URL(videoUrl);
      const hostname = parsed.hostname.replace(/^www\./, '').toLowerCase();

      if (hostname === 'youtu.be') {
        const id = parsed.pathname.slice(1);
        return `https://www.youtube.com/watch?v=${id}`;
      }

      if (
        hostname === 'youtube.com' ||
        hostname === 'm.youtube.com' ||
        hostname === 'music.youtube.com' ||
        hostname === 'www.youtube.com'
      ) {
        parsed.hostname = 'www.youtube.com';
        return parsed.toString();
      }
    } catch (_err) {
      // fallback below
    }

    if (/^[A-Za-z0-9_-]{11}$/.test(videoUrl)) {
      return `https://www.youtube.com/watch?v=${videoUrl}`;
    }

    return `https://www.youtube.com/watch?v=${videoId}`;
  }
}
