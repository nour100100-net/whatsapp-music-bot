const play = require('play-dl');
(async()=>{
  const url = 'https://www.youtube.com/watch?v=_RHIECWv728';
  try {
    console.log('validate', play.yt_validate(url));
    const info = await play.video_info(url);
    console.log('title', info.video_details.title);
    const stream = await play.stream(url);
    console.log('stream type', stream.type);
    console.log('stream keys', Object.keys(stream));
  } catch(e) {
    console.error('ERROR', e);
  }
})();
