// Memoizer that only remembers the most recent input.
const memoizeOne = (fn, resolver) => {
  let resolution;
  let value;
  return (...args) => {
    const newResolution = resolver(...args);
    if (!resolution || resolution !== newResolution) {
      resolution = newResolution;
      value = fn(...args);
    }
    return value;
  };
};

export default memoizeOne;
