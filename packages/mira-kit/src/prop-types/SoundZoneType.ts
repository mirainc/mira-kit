import BaseType, { PropType } from './BaseType';

export default class SoundZoneType extends BaseType<PropType> {
  constructor(label = 'Sound Zone') {
    super(label, 'soundZone');
  }
}
