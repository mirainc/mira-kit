import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import Datetime from 'react-datetime';

const propTypes = {
  presentationProperty: PropTypes.object.isRequired,
  updateAppVar: PropTypes.func.isRequired,
  value: PropTypes.any.isRequired,
};

class DatetimeField extends React.Component {

  handleChange(e) {
    if (e.isValid()) {
      const name = this.props.presentationProperty.name;
      const isoString = e.toDate().toISOString();
      this.props.updateAppVar(name, isoString);
    }
  }

  // used to convert iso string to local date object
  parseISOString(s) {
    const b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));

  }

  render() {
    const presentationProperty = this.props.presentationProperty;
    const name = presentationProperty.name;
    const value = this.props.value;
    let date = new Date();
    const dateVal = value;
    const defaultDateVal = presentationProperty.default;
    if (dateVal) {
      date = this.parseISOString(dateVal);
    } else if (defaultDateVal) {
      date = this.parseISOString(defaultDateVal);

    }
    return (
      <Datetime
        name={presentationProperty.name}
        onChange={e => this.handleChange(e)}
        value={date}
      />
    );
  }
}

DatetimeField.propTypes = propTypes;

export default DatetimeField;
