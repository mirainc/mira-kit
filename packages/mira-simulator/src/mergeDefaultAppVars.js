import { defaults, keyBy, mapValues } from 'lodash/fp';

const keyByName = keyBy('name');
const mapValuesToDefault = mapValues('default');
const isSoundZoneType = property => property.type === 'soundZone';
const setDefaultSoundZone = soundZone => property =>
  isSoundZoneType(property)
    ? defaults({ default: soundZone.id }, property)
    : property;

export default (presentation, appVersion, soundZones = []) => {
  const { application_vars } = presentation;
  const { presentation_properties } = appVersion;
  const [soundZone] = soundZones;

  let presentationProperties = presentation_properties;

  if (soundZone) {
    // use first preview soundZone as default soundZone property value
    presentationProperties = presentationProperties.map(
      setDefaultSoundZone(soundZone),
    );
  }

  const withDefaultAppVars = defaults(
    mapValuesToDefault(keyByName(presentationProperties)),
  );

  const applicationVars = withDefaultAppVars({ ...application_vars });

  return {
    ...presentation,
    application_vars: applicationVars,
  };
};
