import BaseType, { PropType } from './BaseType';

interface Option {
  label: string;
  value: string;
  rightLabel?: string;
  thumbnailUrl?: string;
}

type SortKey = 'default' | 'label' | 'rightLabel';

interface SortConf {
  name: string,
  isNumeric?: boolean,
}

type Sorting = {
  [K in SortKey]?: SortConf;
}

export interface SelectionPropType extends PropType {
  default: string;
  multiple: boolean;
  searchable: boolean;
  selectable: boolean;
  options: Option[];
  optionsUrl: string;
  sorting?: Sorting;
}

export default class SelectionType extends BaseType<SelectionPropType> {
  constructor(label: string) {
    super(label, 'selection');
    this.propType.options = [];
  }

  default(value: string) {
    this.propType.default = value;
    return this;
  }

  multiple(value = true) {
    this.propType.multiple = value;
    return this;
  }

  searchable(value = true) {
    this.propType.searchable = value;
    return this;
  }

  selectable(value = true) {
    this.propType.selectable = value;
    return this;
  }

  option(value: string, label: string, thumbnailUrl?: string) {
    if (!label) label = value;
    this.propType.options.push({ label, value, thumbnailUrl });
    return this;
  }

  optionsUrl(url: string) {
    this.propType.optionsUrl = url;
    return this;
  }

  sortBy(key: SortKey, name: string, isNumeric = false) {
    this.propType.sorting = {
      ...this.propType.sorting,
      [key]: {name, isNumeric},
    };
    return this;
  }
}
