import BaseType, { PropType } from './BaseType';

interface Option {
  label: string;
  value: string;
  thumbnailUrl?: string;
}

export interface AutocompletePropType extends PropType {
  default: string;
  multiple: boolean;
  placeholder: string,
  limitTags: number;
  options: Option[];
  optionsUrl: string;
  queryParamName: string;
}

export default class AutocompleteType extends BaseType<AutocompletePropType> {
  constructor(label: string) {
    super(label, 'autocomplete');
    this.propType.options = [];
  }

  default(value: string) {
    this.propType.default = value;
    return this;
  }

  placeholder(value: string) {
    this.propType.placeholder = value;
    return this;
  }

  multiple(value = true, limitTags: number) {
    this.propType.multiple = value;
    this.propType.limitTags = limitTags;
    return this;
  }

  option(value: string, label: string) {
    if (!label) label = value;
    this.propType.options.push({ value, label });
    return this;
  }

  optionsUrl(url: string) {
    this.propType.optionsUrl = url;
    return this;
  }

  searchUrl(url: string, queryParamName: string) {
    this.propType.optionsUrl = url;
    this.propType.queryParamName = queryParamName;
    return this;
  }
}
