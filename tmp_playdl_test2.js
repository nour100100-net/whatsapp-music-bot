const play = require( play-dl);
(async()=>{
  const url = https://www.youtube.com/watch?v=_RHIECWv728;
  try {
    console.log(validate, play.yt_validate(url));
    const info = await play.video_info(url);
    console.log(info ok);
    const stream = await play.stream_from_info(info);
    console.log(stream ok, stream.type, Object.keys(stream));
  } catch (e) {
    console.error(ERROR, e);
  }
})();
