import BaseType from './BaseType';

export default class SelectionType extends BaseType {
  constructor(label) {
    super(label, 'selection');
    // We currently don't support multi-selects.
    this.propType.exclusive = true;
    this.propType.options = [];
  }

  default(value) {
    this.propType.default = value;
    return this;
  }

  option(value, label) {
    if (!label) label = value;
    this.propType.options.push({ label, value });
    return this;
  }
}
