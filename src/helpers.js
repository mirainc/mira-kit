// This file contains a list of helper functions
import validUrl from 'valid-url';

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
    presPropToAppVarMap[name] = i;
    if (presProp.type !== 'link' && presProp.default) {
      defaultAppVars[name] = presProp.default;
    }
  }
  return { defaultAppVars, presPropToAppVarMap };
}

// function used to validate an individual application variable
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
      const options = presProp.options;
      // if it is exclusive make sure value is a valid selection from pres props
      if (presProp.exclusive) {
        return (
          appVar.label in options && appVar.value === options[appVar.label]
        );
      }
      // if not exclusive check each selection is valid
      return appVar.reduce((isValid, selection) => {
        return (
          isValid &&
          selection.label in options &&
          selection.value === options[selection.label]
        );
      }, true);
    }
    case 'link': {
      // not used in application
      return true;
    }
    case 'file': {
      if (validUrl.isUri(appVar.url)) {
        return true;
      }
      return false;
    }
    default: {
      return false;
    }
  }
}

export function valAppVars(appVars, presProps, presToAppMap) {
  const validatedAppVars = Object.keys(appVars).map(key => {
    console.log(key);
    const valid = valAppVar(appVars[key], presProps[presToAppMap[key]]);
    if (!valid) {
      throw new Error(
        `Invalid Application Variable ${key} with value ${appVars[key]}`,
      );
    }
    return { appVar: key, valid };
  });
}

export function valDuration(value, isConfigurableDuration) {
  const duration = new Number(value);
  if (isConfigurableDuration && (isNaN(duration) || value === '')) {
    throw new Error(`Invalid Duration ${value}`);
  }
  return duration;
}
