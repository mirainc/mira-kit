import FileType from './FileType';

// VideoType is a file type with preset constraints.
export const videoContentTypes = [
  'video/mp4',
  'video/mpeg',
  'video/quicktime',
  'video/x-m4v',
  '.webm',
];
export default class VideoType extends FileType {
  constructor(label: string) {
    super(label);
    this.setConstraint('content-types', videoContentTypes);
  }
}
