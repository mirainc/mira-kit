import BaseType from './BaseType';

export default class FileType extends BaseType {
  constructor(label) {
    super(label, 'file');
    // Cap file size at 500mb by default.
    this.maxSize(500000000);
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
