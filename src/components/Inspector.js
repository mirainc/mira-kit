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

const defaultProps = {
  duration: 0,
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
    const { definition, updateDuration } = this.props;
    if (definition.configurable_duration) {
      const { duration } = this.props;
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
    const presentationProperties = definition.presentation_properties;

    return (
      <div className="Inspector">
        <h1>Application Inputs</h1>
        <h2>
          Application Name: {definition.name}
        </h2>
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
        <button disabled={submit} onClick={this.submitApp}>
          Submit
        </button>
      </div>
    );
  }
}

Inspector.propTypes = propTypes;
Inspector.defaultProps = defaultProps;

export default Inspector;
