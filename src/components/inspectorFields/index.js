import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import DatetimeField from './DatetimeField';
import StringField from './StringField';
import TextField from './TextField';
import NumberField from './NumberField';
import BooleanField from './BooleanField';
import SelectionField from './SelectionField';

const propTypes = {
  presentationProperty: PropTypes.object.isRequired,
  updateAppVar: PropTypes.func.isRequired,
  value: PropTypes.any.isRequired,
};

class InspectorField extends React.Component {
  render() {
    const presentationProperty = this.props.presentationProperty;
    const value = this.props.value;
    const updateAppVar = this.props.updateAppVar;
    switch (presentationProperty.type) {
      case 'string': {
        return (
          <StringField
            presentationProperty={presentationProperty}
            updateAppVar={updateAppVar}
            value={value}
          />
        );
      }
      case 'text': {
        // NOTE: Using static rows and cols for sample
        return (
          <TextField
            presentationProperty={presentationProperty}
            updateAppVar={updateAppVar}
            value={value}
          />
        );
      }

      case 'number': {
        return (
          <NumberField
            presentationProperty={presentationProperty}
            updateAppVar={updateAppVar}
            value={value}
          />
        );
      }
      case 'boolean': {
        const boolVal = value ? true : false;
        return (
          <BooleanField
            presentationProperty={presentationProperty}
            updateAppVar={updateAppVar}
            value={boolVal}
          />
        );
      }

      case 'datetime': {
        return (
          <DatetimeField
            presentationProperty={presentationProperty}
            updateAppVar={updateAppVar}
            value={value}
          />
        );
      }
      case 'selection': {
        return (
          <SelectionField
            presentationProperty={presentationProperty}
            updateAppVar={updateAppVar}
            value={value}
          />
        );
      }

      case 'label': {
        return <input name="label" onChange={() => 'blahh'} value="label" />;
      }
      case 'group': {
        return <input name="group" onChange={() => 'blahh'} value="group" />;
      }
      case 'link': {
        return <input name="link" onChange={() => 'blahh'} value="link" />;
      }
      case 'file': {
        return <input name="file" onChange={() => 'blahh'} value="file" />;
      }
      default: {
        return null;
      }
    }
  }
}

InspectorField.propTypes = propTypes;

export default InspectorField;
