import BaseType from './BaseType';

export default class BooleanType extends BaseType {
  constructor(label) {
    super(label, 'boolean');
  }

  default(value) {
    this.propType.default = value;
    return this;
  }
}
