import BaseType from './BaseType';

// Cap file size at 500mb by default.
export const defaultMaxSize = 500000000;
export default class FileType extends BaseType {
  constructor(label) {
    super(label, 'file');
    this.maxSize(defaultMaxSize);
  }

  contentTypes(contentTypes) {
    this.setConstraint('content-types', contentTypes);
    return this;
  }

  maxSize(bytes) {
    this.setConstraint('content-length', bytes);
    return this;
  }
}
