import BaseType from './BaseType';

export default class FileType extends BaseType {
  constructor(label) {
    super(label, 'file');
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
