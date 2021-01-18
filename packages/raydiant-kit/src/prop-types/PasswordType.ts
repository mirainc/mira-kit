import BaseType, { PropType } from './BaseType';

interface PasswordPropType extends PropType {
  default: string;
}

export default class PasswordType extends BaseType<PasswordPropType> {
  constructor(label: string) {
    super(label, 'password');
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
