import BaseType, { PropType } from './BaseType';

// Cap file size at 500mb by default.
export const defaultMaxSize = 500000000;
export default class FileType extends BaseType<PropType> {
  constructor(label: string) {
    super(label, 'file');
    this.maxSize(defaultMaxSize);
  }

  contentTypes(contentTypes: string[]) {
    this.setConstraint('content-types', contentTypes);
    return this;
  }

  maxSize(bytes: number) {
    this.setConstraint('content-length', bytes);
    return this;
  }
}
