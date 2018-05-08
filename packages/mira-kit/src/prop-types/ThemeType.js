import BaseType from './BaseType';

export default class StringType extends BaseType {
  constructor(label = 'Theme') {
    super(label, 'selection');
    // Tells the consumer (dashboard or simulator) to inject
    // user themes into this prop.
    this.propType.injectThemes = true;
    this.propType.exclusive = true;
    this.propType.options = [];
  }
}
