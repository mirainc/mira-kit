export default (value, fallback) => () => {
  let reason = `${value} is unavailable in the Mira sandbox.`;
  if (fallback) {
    reason += ` Application should use ${fallback} instead.`;
  }

  throw new Error(reason);
};
