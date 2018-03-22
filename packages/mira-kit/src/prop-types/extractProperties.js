export default function extractProperties(
  propTypes,
  properties = [],
  strings = {},
) {
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
    }

    if (typeof propType.helperLink !== 'undefined') {
      const helperLinkStringKey = `${propName}_helperLink`;
      strings[helperLinkStringKey] = propType.helperLink;
      prop.helper_link = helperLinkStringKey;
    }

    if (propType.type === 'selection') {
      prop.options = [];
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

    properties.push(prop);
  });

  return { properties, strings };
}
