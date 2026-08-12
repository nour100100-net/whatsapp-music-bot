export default abstract class BaseDownload {
  abstract handle(videoId: string, videoUrl: string, format?: 'mp3' | 'mp4'): Promise<string>;
}
