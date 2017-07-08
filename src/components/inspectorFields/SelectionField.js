import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  presentationProperty: PropTypes.object.isRequired,
  updateAppVar: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

class SelectionField extends React.Component {
  handleChange(e) {
    e.preventDefault();
    console.log(e);
  }

  render() {
    const presentationProperty = this.props.presentationProperty;
    const applicationVariables = this.props.applicationVariables;
    const name = presentationProperty.name;
    const value = this.props.value;
    const options = presentationProperty.options;
    console.log(presentationProperty);
    console.log(options);
    return (
      <select
          name={name}
          onChange={this.handleChange}
          value={value}>
          {Object.keys(options).map(option => {
            (<option
              key={option}
              value={options[option]}
            />)
          })}
        </select>
    );
  }
}

SelectionField.propTypes = propTypes;

export default SelectionField;
