import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  presentationProperty: PropTypes.object.isRequired,
  updateAppVar: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

class StringField extends React.Component {
  handleChange(e) {
    e.preventDefault();
    const name = this.props.presentationProperty.name;
    this.props.updateAppVar(name, e.target.value);
  }

  render() {
    const presentationProperty = this.props.presentationProperty;
    const applicationVariables = this.props.applicationVariables;
    const name = presentationProperty.name;
    const value = this.props.value;
    const type = presentationProperty.secure ? 'password' : 'text';
    return (
      <input
        name={presentationProperty.name}
        onChange={e => this.handleChange(e)}
        value={value}
        placeholder={presentationProperty.placeholder}
        type={type}
      />
    );
  }
}

StringField.propTypes = propTypes;

export default StringField;
