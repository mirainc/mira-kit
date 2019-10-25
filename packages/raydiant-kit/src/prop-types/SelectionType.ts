import BaseType, { PropType } from './BaseType';

interface Option {
  label: string;
  value: string;
}

export interface SelectionPropType extends PropType {
  default: string;
  multiple: boolean;
  options: Option[];
  optionsUrl: string;
}

export default class SelectionType extends BaseType<SelectionPropType> {
  constructor(label: string) {
    super(label, 'selection');
    this.propType.options = [];
  }

  default(value: string) {
    this.propType.default = value;
    return this;
  }

  multiple(value = true) {
    this.propType.multiple = value;
    return this;
  }

  option(value: string, label: string) {
    if (!label) label = value;
    this.propType.options.push({ label, value });
    return this;
  }

  optionsUrl(url: string) {
    this.propType.optionsUrl = url;
    return this;
  }
}
