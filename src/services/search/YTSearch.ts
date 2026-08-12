import ytdlp from 'yt-dlp-exec';
import { MAX_DURATION } from '../../config';

export default class YTSearch {
  public async find(keyword: string): Promise<SearchResponse> {
    const query = this.buildQuery(keyword);
    const info = (await ytdlp(query, {
      dumpSingleJson: true,
      quiet: true,
      noWarnings: true,
      skipDownload: true,
    })) as any;

    if (!info || !Array.isArray(info.entries) || info.entries.length === 0) {
      throw new Error('No results found for this search.');
    }

    const entry = info.entries.find((video: any) => {
      const duration = typeof video.duration === 'number' ? video.duration : Number(video.duration) || 0;
      return duration <= MAX_DURATION;
    });

    if (!entry) {
      throw new Error('No valid video found within duration limit.');
    }

    const seconds = typeof entry.duration === 'number' ? entry.duration : Number(entry.duration) || 0;

    return {
      seconds,
      title: String(entry.title || ''),
      videoId: String(entry.id || entry.videoId || '').trim(),
      url: String(entry.webpage_url || entry.url || `https://www.youtube.com/watch?v=${entry.id || entry.videoId}`),
    };
  }

  private buildQuery(keyword: string): string {
    const cleaned = keyword.trim().replace(/\s+/g, ' ');
    return `ytsearch1:${cleaned}`;
  }
}
