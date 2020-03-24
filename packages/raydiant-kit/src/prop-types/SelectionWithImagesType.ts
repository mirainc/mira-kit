import BaseType, { PropType } from './BaseType';

export interface SelectionWithImagesPropType extends PropType {
  value: string[];
  imagesUrl: string;
}

export default class SelectionWithImagesType extends BaseType<
  SelectionWithImagesPropType
> {
  constructor(label = 'Selection with images') {
    super(label, 'selectionWithImages');
  }

  imagesUrl(url: string) {
    this.propType.imagesUrl = url;
    return this;
  }
}
