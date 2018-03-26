import BaseType from './BaseType';

export default class NumberType extends BaseType {
  constructor(label) {
    super(label, 'number');
  }

  default(value) {
    this.propType.default = value;
    return this;
  }

  min(min) {
    this.setConstraint('min', min);
    return this;
  }

  max(max) {
    this.setConstraint('max', max);
    return this;
  }
}
