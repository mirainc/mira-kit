import BaseType, { PropType } from './BaseType';

interface Image {
  id: string;
  url: string;
}

export interface ImagePickerPropType extends PropType {
  images: Image[];
  value: string[];
}

export default class ImagePickerType extends BaseType<ImagePickerPropType> {
  constructor(label = 'Image Picker') {
    super(label, 'imagePicker');
    this.propType.images = [];
  }

  images(images: Image[]) {
    this.propType.images = images;
    return this;
  }
}
