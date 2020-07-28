import BaseType, { PropType } from './BaseType';

interface StringPropType extends PropType {
  default: string;
}

export default class StringType extends BaseType<StringPropType> {
  constructor(label: string) {
    super(label, 'string');
  }

  default(value: string) {
    this.propType.default = value;
    return this;
  }

  maxLength(maxLength: number) {
    this.setConstraint('maxlength', maxLength);
    return this;
  }

  format(regex: string, errorMessage: string) {
    this.setConstraint('format', { regex, errorMessage });
    return this;
  }
}
