import { IBaseType } from './BaseType';
import { SelectionPropType } from './SelectionType';
import { ToggleButtonGroupPropType } from './ToggleButtonGroupType';

export default function extractProperties(
  propTypes?: { [key: string]: IBaseType },
  properties: any[] = [],
  strings: { [key: string]: string } = {},
) {
  if (!propTypes) return { properties, strings };

  let hasThemePropType = false;

  Object.keys(propTypes).forEach(propName => {
    const propType = propTypes[propName].toJSON();

    strings[propName] = propType.label;

    const prop: any = {
      name: propName,
      type: propType.type,
      optional: propType.optional,
      constraints: propType.constraints,
      disable: propType.disable,
      hide: propType.hide,
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
      prop.multiple = propType.multiple;

      if (propType.optionsUrl && propType.options.length > 0) {
        throw new Error(
          `Cannot set both an optionsUrl and options for selection '${propType.label}'`,
        );
      }

      prop.options_url = propType.optionsUrl;

      (propType as SelectionPropType).options.forEach(option => {
        strings[option.value] = option.label;
        prop.options.push({
          name: option.value,
          value: option.value,
          thumbnailUrl: option.thumbnailUrl,
        });
      });
    }

    if (propType.type === 'toggleButtonGroup') {
      prop.options = [];
      prop.exclusive = propType.exclusive;

      (propType as ToggleButtonGroupPropType).options.forEach(option => {
        strings[option.value] = option.label;
        prop.options.push({
          label: option.label,
          value: option.value,
          thumbnailUrl: option.thumbnailUrl,
        });
      });
    }

    if (propType.type === 'selectionWithImages') {
      prop.images_url = propType.imagesUrl;
    }

    if (propType.type === 'array') {
      const singularStringKey = `${propName}_singular`;
      strings[singularStringKey] = propType.singularLabel;
      prop.singular_name = singularStringKey;

      const itemProperties: any[] = [];
      extractProperties(propType.items, itemProperties, strings);
      prop.properties = itemProperties;
    }

    if (propType.type === 'theme') {
      // Validate that only one theme type can exist per application.
      if (hasThemePropType) {
        throw new Error(
          'Error extracting properties: Cannot have multiple theme prop types.',
        );
      } else {
        hasThemePropType = true;
      }
    }

    if (
      propType.type === 'oAuth' ||
      propType.type === 'facebookAuth' ||
      propType.type === 'googleAuth'
    ) {
      const {
        authUrl,
        verifyUrl,
        verifyQsParam,
        logoutUrl,
        logoutQsParam,
      } = propType;

      if (!authUrl) {
        throw new Error(
          'Error extracting properties: OAuth type must set authUrl.',
        );
      }
      if (!verifyUrl) {
        throw new Error(
          'Error extracting properties: OAuth type must set verifyUrl.',
        );
      }

      prop.auth_url = authUrl;
      prop.verify_url = verifyUrl;
      prop.verify_qs_param = verifyQsParam;
      prop.logout_url = logoutUrl;
      prop.logout_qs_param = logoutQsParam;
    }

    properties.push(prop);
  });

  return { properties, strings };
}
