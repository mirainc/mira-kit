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

const defaultProps = {
  value: null,
};

class SelectionField extends React.Component {
  handleChange(e) {
    const name = this.props.presentationProperty.name;
    this.props.updateAppVar(name, e);
  }

  render() {
    const presentationProperty = this.props.presentationProperty;
    const name = presentationProperty.name;
    const value = this.props.value;
    const options = Object.keys(presentationProperty.options).map(option => ({
      value: options[option],
      label: option,
    }));
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
SelectionField.defaultProps = defaultProps;

export default SelectionField;
