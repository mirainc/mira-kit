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
    const name = this.props.presentationProperty.name;
    this.props.updateAppVar(name, !e);
  }

  render() {
    const { value } = this.props;
    return <ToggleButton value={value} onToggle={e => this.handleChange(e)} />;
  }
}

BooleanField.propTypes = propTypes;

export default BooleanField;
