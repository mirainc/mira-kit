export default class BaseType {
  constructor(label, type) {
    this.propType = { label, type, optional: true, constraints: {} };
  }

  required() {
    this.propType.optional = false;
    return this;
  }

  helperText(helperText) {
    this.propType.helperText = helperText;
    return this;
  }

  helperLink(helperLink) {
    this.propType.helperLink = helperLink;
    return this;
  }

  setConstraint(key, value) {
    this.propType.constraints[key] = value;
  }

  toJSON() {
    return this.propType;
  }
}
