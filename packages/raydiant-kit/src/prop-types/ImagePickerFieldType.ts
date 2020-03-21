import BaseType, { PropType } from './BaseType';

interface Image {
  id: string;
  url: string;
}

export interface ImagePickerFieldPropType extends PropType {
  value: string[];
  imagesUrl: string;
}

export default class ImagePickerFieldType extends BaseType<
  ImagePickerFieldPropType
> {
  constructor(label = 'Image Picker') {
    super(label, 'imagePickerField');
  }

  imagesUrl(url: string) {
    this.propType.imagesUrl = url;
    return this;
  }
}
