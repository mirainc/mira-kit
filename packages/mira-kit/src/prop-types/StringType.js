import BaseType from './BaseType';

export default class StringType extends BaseType {
  constructor(label) {
    super(label, 'string');
  }

  default(value) {
    this.propType.default = value;
    return this;
  }

  maxLength(maxLength) {
    this.setConstraint('maxlength', maxLength);
    return this;
  }
}
