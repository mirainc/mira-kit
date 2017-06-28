import React from 'react';
import PropTypes from 'prop-types';
import InspectorField from './InspectorField';

const propTypes = {
  definition: PropTypes.object.isRequired,
  submitAppVars: PropTypes.func.isRequired,
  updateAppVar: PropTypes.func.isRequired,
  applicationVariables: PropTypes.object.isRequired,
};

class Inspector extends React.Component {
  constructor() {
    super();
    this.renderDuration = this.renderDuration.bind(this);
  }

  renderDuration(definition) {
    if (definition.configurable_duration) {
      const duration = this.props.applicationVariables.duration
        ? this.props.applicationVariables.duration
        : definition.default_duration;
      const durationProp = {
        type: 'number',
        name: definition.duration,
        value: duration,
      };
      return (
        <div key="duration">
          {'Duration: '}
          <InspectorField
            presentationProperty={durationProp}
            key="duration"
            updateAppVar={this.props.updateAppVar}
          />
        </div>
      );
    }
  }

  render() {
    return (
      <div className="Inspector">
        <h1>Application Inputs</h1>
        <h2>Application Name: {this.props.definition.name}</h2>
        <div>
          {this.props.definition.presentation_properties.map(
            presentationProperty => {
              return (
                <div key={presentationProperty.name}>
                  {`${presentationProperty.name}: `}
                  <InspectorField
                    updateAppVar={this.props.updateAppVar}
                    presentationProperty={presentationProperty}
                  />
                </div>
              );
            },
          )}
          {this.renderDuration(this.props.definition)}
        </div>
        <button
          onClick={() =>
            this.props.submitAppVars(this.props.applicationVariables)}>
          Submit
        </button>
      </div>
    );
  }
}

Inspector.propTypes = propTypes;

export default Inspector;
