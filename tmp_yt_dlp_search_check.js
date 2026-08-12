const ytdlp = require('yt-dlp-exec');
(async () => {
  try {
    const info = await ytdlp('ytsearch1:Wegz ElBakht', {
      dumpSingleJson: true,
      quiet: true,
    });
    console.log('type', typeof info);
    console.log('keys', Object.keys(info));
    if (info.entries && info.entries.length) {
      const e = info.entries[0];
      console.log('entry keys', Object.keys(e));
      console.log('title', e.title);
      console.log('id', e.id);
      console.log('url', e.webpage_url || e.url);
      console.log('duration', e.duration);
    }
  } catch (err) {
    console.error(err);
  }
})();
