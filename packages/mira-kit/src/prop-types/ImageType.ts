import FileType from './FileType';

// ImageType is a file type with preset constraints.
export const imageContentTypes = [
  'image/png',
  'image/jpeg',
  'image/svg+xml',
  'image/bmp',
  'image/tiff',
  'image/gif',
];
export default class ImageType extends FileType {
  constructor(label: string) {
    super(label);
    this.setConstraint('content-types', imageContentTypes);
  }
}
