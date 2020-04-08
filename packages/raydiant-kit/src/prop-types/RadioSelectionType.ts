import BaseType, { PropType } from './BaseType';

interface Option {
  label: string;
  value: string;
  thumbnailUrl?: string;
}

export interface RadioSelectionPropType extends PropType {
  default: string;
  exclusive: boolean;
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

  exclusive(value = true) {
    this.propType.exclusive = value;
    return this;
  }

  option(value: string, label: string, thumbnailUrl?: string) {
    if (!label) label = value;
    this.propType.options.push({ label, value, thumbnailUrl });
    return this;
  }
}
