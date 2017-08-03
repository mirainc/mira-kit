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
    const { presentationProperty, updateAppVar } = this.props;
    const { name } = presentationProperty;
    updateAppVar(name, e.target.value);
  }

  render() {
    const { presentationProperty, value } = this.props;
    const { name } = presentationProperty;
    return (
      <input name={name} onChange={e => this.handleChange(e)} value={value} />
    );
  }
}

NumberField.propTypes = propTypes;

export default NumberField;
