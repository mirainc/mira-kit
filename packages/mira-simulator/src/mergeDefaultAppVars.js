export default (presentation, appVersion) => {
  const appVars = presentation.application_vars;

  appVersion.presentation_properties.forEach(prop => {
    if (
      typeof prop.default !== 'undefined' &&
      typeof appVars[prop.name] === 'undefined'
    ) {
      appVars[prop.name] = prop.default;
    }
  });

  return {
    ...presentation,
    application_vars: appVars,
  };
};
