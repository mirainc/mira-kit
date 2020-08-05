import BaseType, { PropType } from './BaseType';

interface ModalPropType extends PropType {
  sourceUrl: string;
  backgroundColor?: string;
  hoveredBackgroundColor?: string;
  textColor?: string;
}

export default class ModalType extends BaseType<ModalPropType> {
  constructor(label: string, sourceUrl: string) {
    super(label, 'modal');
    this.propType.sourceUrl = sourceUrl;
  }

  background(color: string) {
    this.propType.backgroundColor = color;
    return this;
  }

  hoveredBackground(color: string) {
    this.propType.hoveredBackgroundColor = color;
    return this;
  }

  textColor(color: string) {
    this.propType.textColor = color;
    return this;
  }
}
