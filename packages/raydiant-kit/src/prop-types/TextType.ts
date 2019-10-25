import BaseType, { PropType } from './BaseType';

interface TextPropType extends PropType {
  default: string;
}

export default class TextType extends BaseType<TextPropType> {
  constructor(label: string) {
    super(label, 'text');
  }

  default(value: string) {
    this.propType.default = value;
    return this;
  }

  maxLength(maxLength: number) {
    this.setConstraint('maxlength', maxLength);
    return this;
  }
}
