import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
// Include styles
// import 'react-select/dist/react-select.css';

const propTypes = {
  presentationProperty: PropTypes.object.isRequired,
  updateAppVar: PropTypes.func.isRequired,
  value: PropTypes.any,
};

class SelectionField extends React.Component {
  handleChange(e) {
    const name = this.props.presentationProperty.name;
    this.props.updateAppVar(name, e);
  }

  render() {
    const { presentationProperty, value } = this.props;
    const { name, options } = presentationProperty;
    const multi = !presentationProperty.exclusive;
    return (
      <Select
        name={name}
        value={value}
        options={options}
        onChange={e => this.handleChange(e)}
        multi={multi}
      />
    );
  }
}

SelectionField.propTypes = propTypes;

export default SelectionField;
