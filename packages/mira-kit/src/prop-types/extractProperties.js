export default function extractProperties(
  propTypes,
  properties = [],
  strings = {},
) {
  if (!propTypes) return { properties, strings };

  let hasThemePropType = false;

  Object.keys(propTypes).forEach(propName => {
    const propType = propTypes[propName].toJSON();

    strings[propName] = propType.label;

    const prop = {
      name: propName,
      type: propType.type,
      optional: propType.optional,
      constraints: propType.constraints,
    };

    if (typeof propType.default !== 'undefined') {
      prop.default = propType.default;
    }

    if (typeof propType.helperText !== 'undefined') {
      const helperTextStringKey = `${propName}_helperText`;
      strings[helperTextStringKey] = propType.helperText;
      prop.helper_text = helperTextStringKey;
      prop.helper_link = propType.helperLink;
    }

    if (propType.type === 'selection') {
      prop.options = [];
      prop.exclusive = propType.exclusive;
      propType.options.forEach(option => {
        strings[option.value] = option.label;
        prop.options.push({ name: option.value, value: option.value });
      });
    }

    if (propType.type === 'array') {
      const singularStringKey = `${propName}_singular`;
      strings[singularStringKey] = propType.singularLabel;
      prop.singular_name = singularStringKey;

      const itemProperties = [];
      extractProperties(propType.items, itemProperties, strings);
      prop.properties = itemProperties;
    }

    // TODO: validate that only one prop can exist with injectThemes.
    if (propType.injectThemes) {
      if (hasThemePropType) {
        throw new Error(
          'Error extracting properties: Cannot have multiple theme prop types.',
        );
      } else {
        prop.inject_themes = true;
        hasThemePropType = true;
      }
    }

    properties.push(prop);
  });

  return { properties, strings };
}
