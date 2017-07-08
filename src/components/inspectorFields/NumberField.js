import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  presentationProperty: PropTypes.object.isRequired,
  updateAppVar: PropTypes.func.isRequired,
  value: PropTypes.any,
};

class NumberField extends React.Component {
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
      />
    );
  }
}

NumberField.propTypes = propTypes;

export default NumberField;
