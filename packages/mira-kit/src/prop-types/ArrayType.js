import BaseType from './BaseType';

export default class ArrayType extends BaseType {
  constructor(label, singularLabel) {
    super(label, 'array');
    this.propType.singularLabel = singularLabel;
  }

  default(value) {
    this.propType.default = value;
    return this;
  }

  items(items) {
    this.propType.items = items;
    return this;
  }
}
