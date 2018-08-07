import BaseType, { IBaseType, PropType } from './BaseType';

interface Items {
  [key: string]: IBaseType;
}

interface ArrayPropType extends PropType {
  singularLabel: string;
  default: any[];
  items: Items;
}

export default class ArrayType extends BaseType<ArrayPropType> {
  constructor(label: string, singularLabel: string) {
    super(label, 'array');
    this.propType.singularLabel = singularLabel;
  }

  default(value: any[]) {
    this.propType.default = value;
    return this;
  }

  items(items: Items) {
    this.propType.items = items;
    return this;
  }
}
