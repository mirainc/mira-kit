import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

const propTypes = {
  presentationProperty: PropTypes.object.isRequired,
  updateAppVar: PropTypes.func.isRequired,
  value: PropTypes.any,
  strings: PropTypes.object.isRequired,
};

const defaultProps = {
  value: null,
};

class SelectionField extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
  }

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
    const { presentationProperty, value, strings } = this.props;
    const { name, options, exclusive } = presentationProperty;
    // maps options to react selection options
    const selOptions = options.map(option => ({
      label: strings[option.name],
      value: option.value,
    }));
    const multi = !exclusive;
    return (
      <Select
        name={name}
        value={value}
        options={selOptions}
        onChange={this.handleChange}
        multi={multi}
      />
    );
  }
}

SelectionField.propTypes = propTypes;
SelectionField.defaultProps = defaultProps;

export default SelectionField;
