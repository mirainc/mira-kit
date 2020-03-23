import BaseType, { PropType } from './BaseType';

export interface SelectionWithImagePropType extends PropType {
  value: string[];
  imagesUrl: string;
}

export default class SelectionWithImageType extends BaseType<
  SelectionWithImagePropType
> {
  constructor(label = 'Selection with image') {
    super(label, 'selectionWithImage');
  }

  imagesUrl(url: string) {
    this.propType.imagesUrl = url;
    return this;
  }
}
