import React from 'react';
import PropTypes from 'prop-types';
import InspectorField from './inspectorFields';

const propTypes = {
  definition: PropTypes.object.isRequired,
  submitAppVars: PropTypes.func.isRequired,
  updateAppVar: PropTypes.func.isRequired,
  applicationVariables: PropTypes.object.isRequired,
  updateDuration: PropTypes.func.isRequired,
  duration: PropTypes.any,
  submit: PropTypes.bool.isRequired,
};

class Inspector extends React.Component {
  constructor() {
    super();
    this.submitApp = this.submitApp.bind(this);
  }

  submitApp() {
    const { applicationVariables, submitAppVars } = this.props;
    submitAppVars(applicationVariables);
  }

  renderDuration() {
    const { definition, updateDuration, duration } = this.props;
    const { configurable_duration: configurableDuration } = definition;
    if (configurableDuration) {
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
            updateAppVar={updateDuration}
            value={duration}
          />
        </div>
      );
    }
    return null;
  }
  render() {
    const {
      submit,
      applicationVariables,
      updateAppVar,
      definition,
    } = this.props;
    const { presentation_properties: presentationProperties } = definition;
    const { appName } = definition;

    return (
      <div className="Inspector">
        <h1>Application Inputs</h1>
        <h2>
          Application Name: {appName}
        </h2>
        <div>
          {presentationProperties.map(presentationProperty => {
            const { name } = presentationProperty;
            const value = name in applicationVariables
              ? applicationVariables[name]
              : '';
            return (
              <div key={name}>
                {`${name}: `}
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
        <button disabled={submit} onClick={this.submitApp}>
          Submit
        </button>
      </div>
    );
  }
}

Inspector.propTypes = propTypes;

export default Inspector;
