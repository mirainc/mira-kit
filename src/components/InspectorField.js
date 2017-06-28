import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  presentationProperty: PropTypes.object.isRequired,
  updateAppVar: PropTypes.func.isRequired,
};


class InspectorField extends React.Component {

  handleStringChange(e, key) {
    e.preventDefault();
    const name = this.props.presentationProperty.name;
    this.props.updateAppVar(name, e.target.value);
  }

  render() {
    // console.log(this.props);
    const presentationProperty = this.props.presentationProperty;
    //console.log(presentationProperty);
    switch (presentationProperty.type) {
      case 'string': {
        const name = presentationProperty.name;
        const value = presentationProperty.value;
        const type = presentationProperty.secure ? 'password' : 'text';
        return (
          <input
            name={presentationProperty.name}
            onChange={e => this.handleStringChange(e)}
            value={presentationProperty.value}
            placeholder={presentationProperty.default}
            type={type}
          />
        );
      }
      case 'text': {
        // NOTE: Using static rows and cols for sample
        return (
          <textarea
            name={presentationProperty.name}
            onChange={e => this.handleStringChange(e)}
            rows="4"
            cols="40"
            placeholder={presentationProperty.default}
          >
          {presentationProperty.value}
        </textarea>
        );
      }

      case 'number': {
        return (
          <input
            name={presentationProperty.name}
            onChange={e => this.handleStringChange(e)}
            value={presentationProperty.value}
            placeholder={`default duration ${presentationProperty.defaultValue} seconds`}
          />
        );
      }
      case 'boolean': {
        return (
          <input
            name={presentationProperty.name}
            onChange={() => 'blahh'}
            value={'boolean'}
          />
        );
      }

      case 'datetime': {
        return (
          <input
            name={presentationProperty.name}
            onChange={() => 'blahh'}
            value={'datetime'}
          />
        );
      }
      case 'selection': {
        return (
          <input
            name={presentationProperty.name}
            onChange={() => 'blahh'}
            value={'selection'}
          />
        );
      }

      case 'label': {
        return (
          <input
            name={presentationProperty.name}
            onChange={() => 'blahh'}
            value={'label'}
          />
        );
      }
      case 'group': {
        return (
          <input
            name={presentationProperty.name}
            onChange={() => 'blahh'}
            value={'group'}
          />
        );
      }
      case 'link': {
        return (
          <input
            name={presentationProperty.name}
            onChange={() => 'blahh'}
            value={'link'}
          />
        );
      }
      case 'file': {
        return (
          <input
            name={presentationProperty.name}
            onChange={() => 'blahh'}
            value={'file'}
          />
        );
      }
      default: {
        return null;
      }
    }
  }
}

InspectorField.propTypes = propTypes;

export default InspectorField;
