import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  presentationProperty: PropTypes.object.isRequired,
  updateAppVar: PropTypes.func.isRequired,
  value: PropTypes.any,
};

const defaultProps = {
  value: null,
};

class NumberField extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
  }

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
      <input name={name} onChange={this.handleChange} value={value} />
    );
  }
}

NumberField.propTypes = propTypes;
NumberField.defaultProps = defaultProps;
export default NumberField;
