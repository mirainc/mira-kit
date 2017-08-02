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
    const { presentationProperty, updateAppVar } = this.props;
    const { name, exclusive } = presentationProperty;
    /*
     * NOTE: If exclusie the value will be an object.
     * If it is not, it will be an array of objects.
    */
    if (exclusive) {
      // if null set to empty string and updateAppVar will clear it
      const val = e ? e.value : '';
      updateAppVar(name, val);
    } else {
      const values = e.map(val => val.value);
      // if empty array set to empty string and updateAppVar will clear it
      const vals = values.length > 0 ? values : '';
      updateAppVar(name, vals);
    }
  }

  render() {
    const { presentationProperty, value } = this.props;
    const { name, options, exclusive } = presentationProperty;
    // maps options to react selection options
    const selOptions = options.map(option => ({
      label: option.name,
      value: option.value,
    }));
    const multi = !exclusive;
    return (
      <Select
        name={name}
        value={value}
        options={selOptions}
        onChange={e => this.handleChange(e)}
        multi={multi}
      />
    );
  }
}

SelectionField.propTypes = propTypes;

export default SelectionField;
