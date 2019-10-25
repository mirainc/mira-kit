import BaseType, { PropType } from './BaseType';

interface NumberPropType extends PropType {
  default: number;
}

export default class NumberType extends BaseType<NumberPropType> {
  constructor(label: string) {
    super(label, 'number');
  }

  default(value: number) {
    this.propType.default = value;
    return this;
  }

  min(min: number) {
    this.setConstraint('min', min);
    return this;
  }

  max(max: number) {
    this.setConstraint('max', max);
    return this;
  }
}
