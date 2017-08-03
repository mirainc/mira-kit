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
    const { presentationProperty, updateAppVar } = this.props;
    const { name } = presentationProperty;
    updateAppVar(name, e.target.value);
  }

  render() {
    const { presentationProperty, value } = this.props;
    const { name, secure, placeholder } = presentationProperty;
    const type = secure ? 'password' : 'text';
    return (
      <input
        name={name}
        onChange={e => this.handleChange(e)}
        value={value}
        placeholder={placeholder}
        type={type}
      />
    );
  }
}

StringField.propTypes = propTypes;

export default StringField;
