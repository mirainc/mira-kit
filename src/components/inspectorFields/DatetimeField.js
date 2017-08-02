import React from 'react';
import PropTypes from 'prop-types';
import Datetime from 'react-datetime';
import { parseISOString } from '../../helpers';

const propTypes = {
  presentationProperty: PropTypes.object.isRequired,
  updateAppVar: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

/* NOTE: Empty value for this component renders 'invalid date'.
 * This is not stored in application variables because the value is ''.
 */
class DatetimeField extends React.Component {
  handleChange(e) {
    const { updateAppVar, presentationProperty } = this.props;
    const { name } = presentationProperty;
    if (typeof e.isValid === 'function' && e.isValid()) {
      const isoString = e.toDate().toISOString();
      updateAppVar(name, isoString);
    }
  }

  render() {
    const { value, presentationProperty } = this.props;
    const { name } = presentationProperty;
    const date = parseISOString(value);
    return (
      <Datetime name={name} onChange={e => this.handleChange(e)} value={date} />
    );
  }
}

DatetimeField.propTypes = propTypes;

export default DatetimeField;
