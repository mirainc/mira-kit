type Constraint = string | number | Array<string | number> | { regex: string; errorMessage: string };

export interface PropType {
  label: string;
  type: string;
  optional: boolean;
  constraints: { [key: string]: Constraint };
  helperText?: string;
  helperLink?: string;
  hide?: boolean;
  disable?: boolean;
}

export interface IBaseType {
  required(): IBaseType;
  helperText(helperText: string): IBaseType;
  helperLink(helperLink: string): IBaseType;
  setConstraint(key: string, value: string | number): IBaseType;
  toJSON(): any;
}

export default class BaseType<P extends PropType> implements IBaseType {
  propType: P;

  constructor(label: string, type: string) {
    (this.propType as PropType) = {
      label,
      type,
      optional: true,
      constraints: {},
    };
  }

  required() {
    this.propType.optional = false;
    return this;
  }

  helperText(helperText: string) {
    this.propType.helperText = helperText;
    return this;
  }

  helperLink(helperLink: string) {
    this.propType.helperLink = helperLink;
    return this;
  }

  setConstraint(key: string, value: Constraint) {
    this.propType.constraints[key] = value;
    return this;
  }

  hide(hide = true) {
    this.propType.hide = hide;
    return this;
  }

  show(show = true) {
    this.propType.hide = !show;
    return this;
  }

  disable(disable = true) {
    this.propType.disable = disable;
    return this;
  }

  enable(enable = true) {
    this.propType.disable = !enable;
    return this;
  }

  toJSON() {
    return this.propType;
  }
}
