import BaseType, { PropType } from './BaseType';

export default class ThemeType extends BaseType<PropType> {
  constructor(label = 'Theme') {
    super(label, 'theme');
  }
}
