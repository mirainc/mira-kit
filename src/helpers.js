// This file contains a list of helper functions

// Convert UTC ISO String to local time
export function parseISOString(s) {
  const b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

// set defaults and map presProp indicies to appVar keys
export function initAppVars(presProps) {
  const defaultAppVars = {};
  const presPropToAppVarMap = {};
  for (let i = 0; i < presProps.length; i++) {
    const presProp = presProps[i];
    const name = presProp.name;
    defaultAppVars[name] = presProp.default ? presProp.default : '';
    presPropToAppVarMap[name] = i;
  }
  return { defaultAppVars, presPropToAppVarMap };
}

function valAppVar(appVar, presProp) {
  switch (presProp.type) {
    case 'string': {
      return typeof appVar === 'string';
    }
    case 'text': {
      return typeof appVar === 'string';
    }
    case 'number': {
      const parsedNumber = new Number(appVar);
      return !isNaN(parsedNumber) && appVar !== '';
    }
    case 'boolean': {
      return typeof appVar === 'boolean';
    }

    case 'datetime': {
      const date = parseISOString(appVar);
      return !isNaN(date.getTime());
    }
    case 'selection': {
    }

    case 'label': {
      return typeof appVar === 'string';
    }
    case 'group': {
    }
    case 'link': {
    }
    case 'file': {
    }
    default: {
      return false;
    }
  }
}

export function valAppVars(appVars, presProps, presToAppMap) {
  const validatedAppVars = Object.keys(appVars).map(key => {
    const valid = valAppVar(appVars[key], presProps[presToAppMap[key]]);
    if (!valid) {
      throw new Error(
        `Invalid Application Variable ${key} with value ${appVars[key]}`,
      );
    }
    return { appVar: key, valid };
  });
}
