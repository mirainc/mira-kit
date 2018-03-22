import FileType from './FileType';

// ImageType is a file type with preset constraints.
export const imageContentTypes = ['image/png', 'image/jpeg', 'image/gif'];
export default class ImageType extends FileType {
  constructor(label) {
    super(label);
    this.setConstraint('content-types', imageContentTypes);
  }
}
