import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  presentationProperty: PropTypes.object.isRequired,
  updateAppVar: PropTypes.func.isRequired,
  value: PropTypes.any.isRequired,
};

class StringField extends React.Component {
  handleChange(e) {
    e.preventDefault();
    const name = this.props.presentationProperty.name;
    this.props.updateAppVar(name, e.target.value);
  }

  render() {
    const presentationProperty = this.props.presentationProperty;
    const name = presentationProperty.name;
    const value = this.props.value;
    return (
      <input
        name={presentationProperty.name}
        onChange={e => this.handleChange(e)}
        value={value}
        placeholder={presentationProperty.defaultValue}
      />
    );
  }
}

StringField.propTypes = propTypes;

export default StringField;
