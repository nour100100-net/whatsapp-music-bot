const ytdl = require('ytdl-core');
(async () => {
  const url = 'https://www.youtube.com/watch?v=_RHIECWv728';
  const id = '_RHIECWv728';
  try {
    console.log('validateURL', ytdl.validateURL(url));
    console.log('validateID', ytdl.validateID(id));
    const info = await ytdl.getInfo(url);
    console.log('audio formats', info.formats.filter(f => f.mimeType && f.mimeType.startsWith('audio')).length);
  } catch (e) {
    console.error('error', e && e.message ? e.message : e);
  }
})();
