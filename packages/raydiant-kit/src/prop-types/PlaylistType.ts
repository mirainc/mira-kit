import BaseType, { PropType } from './BaseType';

export default class PlaylistType extends BaseType<PropType> {
  constructor(label = 'Playlist') {
    super(label, 'playlist');
  }
}
