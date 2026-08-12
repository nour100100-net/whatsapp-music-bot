const search = require('yt-search');
(async () => {
  try {
    const res = await search('Wegz ElBakht');
    console.log('result keys', Object.keys(res));
    if (res.videos && res.videos.length) {
      const v = res.videos[0];
      console.log('video keys', Object.keys(v));
      console.log('title type', typeof v.title, v.title);
      console.log('url', v.url);
      console.log('videoId', v.videoId);
      console.log('seconds', v.seconds);
    } else {
      console.log('no videos');
    }
  } catch (e) {
    console.error(e);
  }
})();
