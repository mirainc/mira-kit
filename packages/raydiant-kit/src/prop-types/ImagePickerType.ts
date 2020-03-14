import BaseType, { PropType } from './BaseType';

interface Image {
  id: string;
  url: string;
}

export interface ImagePickerPropType extends PropType {
  images: Image[];
  value: string[];
  imagesUrl: string;
}

export default class ImagePickerType extends BaseType<ImagePickerPropType> {
  constructor(label = 'Image Picker') {
    super(label, 'imagePicker');
    this.propType.images = [];
  }

  imagesUrl(url: string) {
    this.propType.imagesUrl = url;
    return this;
  }
}
