import React from 'react';

class InspectorField extends React.Component {
  constructor() {
    super();
    //getInitialState
  }

  handleStringChange(e, key) {
    e.preventDefault();
    const name = this.props.name;
    this.props.updateAppVar(name, e.target.value);
  }

  render() {
    // console.log(this.props);
    switch (this.props.type) {
      case 'string': {
        return (
          <input
            name={this.props.name}
            onChange={e => this.handleStringChange(e)}
            value={this.props.value}
            placeholder={`enter text for ${this.props.name}`}
          />
        );
      }
      case 'text': {
        return (
          <input
            name={this.props.name}
            onChange={e => this.handleStringChange(e)}
            value={this.props.value}
            placeholder={`enter text for ${this.props.name}`}
          />
        );
      }

      case 'number': {
        return (
          <input
            name={this.props.name}
            onChange={e => this.handleStringChange(e)}
            value={this.props.value}
            placeholder={`default duration ${this.props.defaultValue} seconds`}
          />
        );
      }
      case 'boolean': {
        return (
          <input
            name={this.props.name}
            onChange={() => 'blahh'}
            value={'boolean'}
          />
        );
      }

      case 'datetime': {
        return (
          <input
            name={this.props.name}
            onChange={() => 'blahh'}
            value={'datetime'}
          />
        );
      }
      case 'selection': {
        return (
          <input
            name={this.props.name}
            onChange={() => 'blahh'}
            value={'selection'}
          />
        );
      }

      case 'label': {
        return (
          <input
            name={this.props.name}
            onChange={() => 'blahh'}
            value={'label'}
          />
        );
      }
      case 'group': {
        return (
          <input
            name={this.props.name}
            onChange={() => 'blahh'}
            value={'group'}
          />
        );
      }
      case 'link': {
        return (
          <input
            name={this.props.name}
            onChange={() => 'blahh'}
            value={'link'}
          />
        );
      }
      case 'file': {
        return (
          <input
            name={this.props.name}
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

InspectorField.propTypes = {
  name: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  updateAppVar: React.PropTypes.func.isRequired,
};

export default InspectorField;
