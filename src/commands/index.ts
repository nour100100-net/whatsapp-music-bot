import { PREFIX } from '../config';
import play from './play';
import video from './video';
import help from './help';

export default {
  [`${PREFIX}play`]: play,
  [`${PREFIX}v`]: video,
  [`${PREFIX}help`]: help,
};
