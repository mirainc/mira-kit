import React from 'react';
import PropTypes from 'prop-types';
import DatetimeField from './DatetimeField';
import StringField from './StringField';
import TextField from './TextField';
import NumberField from './NumberField';
import BooleanField from './BooleanField';
import SelectionField from './SelectionField';
import LinkField from './LinkField';
import FileField from './FileField';

const propTypes = {
  presentationProperty: PropTypes.object.isRequired,
  updateAppVar: PropTypes.func.isRequired,
  value: PropTypes.any.isRequired,
};

const InspectorField = props => {
  const { presentationProperty, value, updateAppVar } = props;
  const { type } = presentationProperty;
  switch (type) {
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
      // set value to bool
      const boolVal = !!value;
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
    case 'link': {
      return <LinkField presentationProperty={presentationProperty} />;
    }
    case 'file': {
      return (
        <FileField
          presentationProperty={presentationProperty}
          updateAppVar={updateAppVar}
          value={value}
        />
      );
    }
    default: {
      return null;
    }
  }
};

InspectorField.propTypes = propTypes;

export default InspectorField;
