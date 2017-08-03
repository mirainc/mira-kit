import React from 'react';
import PropTypes from 'prop-types';
import ToggleButton from 'react-toggle-button';

const propTypes = {
  presentationProperty: PropTypes.object.isRequired,
  updateAppVar: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
};

class BooleanField extends React.Component {
  handleChange(e) {
    const { presentationProperty, updateAppVar } = this.props;
    const { name } = presentationProperty;
    updateAppVar(name, !e);
  }

  render() {
    const { value } = this.props;
    return <ToggleButton value={value} onToggle={e => this.handleChange(e)} />;
  }
}

BooleanField.propTypes = propTypes;

export default BooleanField;
