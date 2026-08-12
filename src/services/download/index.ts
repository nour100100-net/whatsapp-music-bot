import fs from 'fs';
import path from 'path';
import BaseDownload from './base';
import YTDownload from './YTDownload';
import { DOWNLOAD_PATH } from '../../config';

export default class Downloader extends BaseDownload {
  private ytDownload: YTDownload;

  private cachedFiles: string[];

  constructor() {
    super();
    this.ytDownload = new YTDownload();
    
    // Clean up problematic placeholder files
    try {
      if (!fs.existsSync(DOWNLOAD_PATH)) {
        fs.mkdirSync(DOWNLOAD_PATH, { recursive: true });
      }
      
      const files = fs.readdirSync(DOWNLOAD_PATH);
      const problematicFiles = files.filter(f => !f.endsWith('.mp3') && !f.endsWith('.mp4'));
      
      problematicFiles.forEach(file => {
        const filePath = path.join(DOWNLOAD_PATH, file);
        try {
          fs.unlinkSync(filePath);
          console.log(`[CLEANUP] Removed: ${file}`);
        } catch (e) {
          console.warn(`[CLEANUP] Failed to remove ${file}`);
        }
      });
    } catch (e) {
      console.warn('[CLEANUP] Error during cleanup');
    }
    
    this.cachedFiles = this.getCachedFiles();
    console.log(`[INFO] Cached files: ${this.cachedFiles.length}`);
  }

  public async handle(videoId: string, videoUrl: string, format: 'mp3' | 'mp4' = 'mp3'): Promise<string> {
    const extension = format === 'mp3' ? 'mp3' : 'mp4';
    const fileName = `${videoId}.${extension}`;

    if (this.isFileDownloaded(fileName)) {
      return path.join(DOWNLOAD_PATH, fileName);
    }

    const result = await this.ytDownload.download(videoId, videoUrl, format);

    this.cachedFiles = [...this.cachedFiles, fileName];

    return result;
  }

  private isFileDownloaded(fileName: string): boolean {
    return this.cachedFiles.includes(fileName);
  }

  protected getCachedFiles(): string[] {
    if (!fs.existsSync(DOWNLOAD_PATH)) {
      fs.mkdirSync(DOWNLOAD_PATH, { recursive: true });
    }

    return fs.readdirSync(DOWNLOAD_PATH);
  }
}
