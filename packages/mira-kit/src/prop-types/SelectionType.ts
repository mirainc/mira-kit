import BaseType, { PropType } from './BaseType';

interface Option {
  label: string;
  value: string;
}

export interface SelectionPropType extends PropType {
  default: string;
  exclusive: boolean;
  options: Option[];
}

export default class SelectionType extends BaseType<SelectionPropType> {
  constructor(label: string) {
    super(label, 'selection');
    // We currently don't support multi-selects.
    this.propType.exclusive = true;
    this.propType.options = [];
  }

  default(value: string) {
    this.propType.default = value;
    return this;
  }

  option(value: string, label: string) {
    if (!label) label = value;
    this.propType.options.push({ label, value });
    return this;
  }
}
