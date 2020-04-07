import BaseType, { PropType } from './BaseType';

interface Option {
  label: string;
  value: string;
  iconName: string;
}

export interface RadioSelectionPropType extends PropType {
  default: string;
  options: Option[];
}

export default class RadioSelection extends BaseType<RadioSelectionPropType> {
  constructor(label: string) {
    super(label, 'radioSelection');
    this.propType.options = [];
  }

  default(value: string) {
    this.propType.default = value;
    return this;
  }

  option(value: string, label: string, iconName?: string) {
    if (!label) label = value;
    this.propType.options.push({ label, value, iconName });
    return this;
  }
}
