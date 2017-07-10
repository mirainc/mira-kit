import React from 'react';
import PropTypes from 'prop-types';
import InspectorField from './InspectorFields';

const propTypes = {
  definition: PropTypes.object.isRequired,
  submitAppVars: PropTypes.func.isRequired,
  updateAppVar: PropTypes.func.isRequired,
  applicationVariables: PropTypes.object.isRequired,
  updateDuration: PropTypes.func.isRequired,
  duration: PropTypes.any,
};

class Inspector extends React.Component {
  constructor() {
    super();
    this.renderDuration = this.renderDuration.bind(this);
  }

  renderDuration() {
    const definition = this.props.definition;
    if (definition.configurable_duration) {
      const duration = this.props.duration;
      const durationProp = {
        type: 'number',
        name: 'duration',
      };
      return (
        <div key="duration">
          {'Duration: '}
          <InspectorField
            presentationProperty={durationProp}
            key="duration"
            updateAppVar={this.props.updateDuration}
            value={duration}
          />
        </div>
      );
    }
  }

  render() {
    const applicationVariables = this.props.applicationVariables;
    const updateAppVar = this.props.updateAppVar;
    const submitAppVars = this.props.submitAppVars;
    const definition = this.props.definition;
    const presentationProperties = definition.presentation_properties;

    return (
      <div className="Inspector">
        <h1>Application Inputs</h1>
        <h2>Application Name: {this.props.definition.name}</h2>
        <div>
          {presentationProperties.map(presentationProperty => {
            const name = presentationProperty.name;
            let value = '';
            if (name in applicationVariables) {
              value = applicationVariables[name];
            } else if (presentationProperty.default) {
              value = presentationProperty.default;
            }
            return (
              <div key={presentationProperty.name}>
                {`${presentationProperty.name}: `}
                <InspectorField
                  updateAppVar={updateAppVar}
                  presentationProperty={presentationProperty}
                  value={value}
                />
              </div>
            );
          })}
          {this.renderDuration()}
        </div>
        <button onClick={() => submitAppVars(applicationVariables)}>
          Submit
        </button>
      </div>
    );
  }
}

Inspector.propTypes = propTypes;

export default Inspector;
