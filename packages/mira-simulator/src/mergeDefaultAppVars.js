export default (presentation, appVersion, soundZones = []) => {
  const appVars = { ...presentation.application_vars };

  appVersion.presentation_properties.forEach(prop => {
    const propValue = appVars[prop.name];

    if (propValue === undefined) {
      if (prop.type === 'soundZone' && soundZones.length > 0) {
        appVars[prop.name] = soundZones[0].id;
      } else if (prop.default !== undefined) {
        appVars[prop.name] = prop.default;
      }
    }
  });

  return {
    ...presentation,
    application_vars: appVars,
  };
};
