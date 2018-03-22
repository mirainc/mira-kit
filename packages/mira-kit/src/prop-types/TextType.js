import BaseType from './BaseType';

export default class TextType extends BaseType {
  constructor(label) {
    super(label, 'text');
  }

  maxLength(maxLength) {
    this.setConstraint('maxlength', maxLength);
    return this;
  }

  default(value) {
    this.propType.default = value;
    return this;
  }
}
