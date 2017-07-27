import React from 'react';
import PropTypes from 'prop-types';
import Datetime from 'react-datetime';
import { parseISOString } from '../../helpers';

const propTypes = {
  presentationProperty: PropTypes.object.isRequired,
  updateAppVar: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

class DatetimeField extends React.Component {
  handleChange(e) {
    if (typeof e.isValid === 'function' && e.isValid()) {
      const name = this.props.presentationProperty.name;
      const isoString = e.toDate().toISOString();
      this.props.updateAppVar(name, isoString);
    }
  }

  render() {
    const { value, presentationProperty } = this.props;
    const { name } = presentationProperty;
    let date = new Date();
    const dateVal = value;
    const defaultDateVal = presentationProperty.default;
    if (dateVal) {
      date = parseISOString(dateVal);
    } else if (defaultDateVal) {
      date = parseISOString(defaultDateVal);
    }
    return (
      <Datetime name={name} onChange={e => this.handleChange(e)} value={date} />
    );
  }
}

DatetimeField.propTypes = propTypes;

export default DatetimeField;
