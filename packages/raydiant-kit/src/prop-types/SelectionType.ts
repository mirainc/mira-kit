import BaseType, { PropType } from './BaseType';

interface Option {
  label: string;
  value: string;
  rightLabel?: string;
  thumbnailUrl?: string;
}

interface SortOption {
  label: string,
  by: 'default' | 'label' | 'rightLabel',
  type?: 'string' | 'number' | 'boolean',
  defaultDirection?: 'asc' | 'desc',
}

export interface SelectionPropType extends PropType {
  default: string;
  multiple: boolean;
  searchable: boolean;
  selectable: boolean;
  sortable?: SortOption[];
  options: Option[];
  optionsUrl: string;
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

  sortable(sortOptions: SortOption[]) {
    this.propType.sortable = sortOptions;
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
}
