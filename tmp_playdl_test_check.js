const play = require('play-dl');
(async () => {
  const url = 'https://www.youtube.com/watch?v=_RHIECWv728';
  const id = '_RHIECWv728';
  try {
    console.log('yt_validate URL:', await play.yt_validate(url));
    console.log('yt_validate ID:', await play.yt_validate(id));
  } catch (e) {
    console.error('validate error', e && e.message ? e.message : e);
  }
  try {
    const info = await play.video_info(url);
    console.log('video_info succeeded', info && info.video_details && info.video_details.title);
    const stream = await play.stream_from_info(info);
    console.log('stream type', stream.type);
  } catch (e) {
    console.error('video_info/stream error', e && e.message ? e.message : e);
  }
})();
