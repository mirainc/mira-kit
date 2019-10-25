import BaseType, { PropType } from './BaseType';

interface BooleanPropType extends PropType {
  default: boolean;
}

export default class BooleanType extends BaseType<BooleanPropType> {
  constructor(label: string) {
    super(label, 'boolean');
  }

  default(value: boolean) {
    this.propType.default = value;
    return this;
  }
}
