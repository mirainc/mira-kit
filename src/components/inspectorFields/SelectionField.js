import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
//Include styles
//import 'react-select/dist/react-select.css';

const propTypes = {
  presentationProperty: PropTypes.object.isRequired,
  updateAppVar: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

class SelectionField extends React.Component {
  handleChange(e) {
    const name = this.props.presentationProperty.name;
    this.props.updateAppVar(name, e);
  }

  fetchOptions(options) {
    return Object.keys(options).map(option => {
      return { value: options[option], label: option };
    });
  }

  render() {
    const presentationProperty = this.props.presentationProperty;
    const applicationVariables = this.props.applicationVariables;
    const name = presentationProperty.name;
    const value = this.props.value;
    const options = this.fetchOptions(presentationProperty.options);
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
