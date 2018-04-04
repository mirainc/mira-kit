import FileType from './FileType';

// VideoType is a file type with preset constraints.
export const videoContentTypes = ['video/mp4', 'video/mpeg', 'video/quicktime'];
export default class VideoType extends FileType {
  constructor(label) {
    super(label);
    this.setConstraint('content-types', videoContentTypes);
  }
}
