import React from 'react';
import PropTypes from 'prop-types';
import ToggleButton from 'react-toggle-button';

const propTypes = {
  presentationProperty: PropTypes.object.isRequired,
  updateAppVar: PropTypes.func.isRequired,
  value: PropTypes.any.isRequired,
};

class BooleanField extends React.Component {
  handleChange(e) {
    const name = this.props.presentationProperty.name;
    console.log(e);
    // this.props.updateAppVar(name, e.target.value);
  }

  render() {
    const presentationProperty = this.props.presentationProperty;
    const name = presentationProperty.name;
    const value = this.props.value;
    return (
      <ToggleButton
        value={value}
        onToggle={e => handleChange(e)}
      />
    );
  }
}

BooleanField.propTypes = propTypes;

export default BooleanField;
