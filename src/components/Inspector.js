import React from 'react';
import InspectorField from './InspectorField';

class Inspector extends React.Component {
  constructor() {
    super();
    this.renderDuration = this.renderDuration.bind(this);
  }

  renderDuration(definition) {
    if (definition.configurable_duration) {
      return (
        <div key="duration">
          <InspectorField
            type="number"
            name="duration"
            key="duration"
            defaultValue={definition.default_duration}
            updateAppVar={this.props.updateAppVar}
            value={this.props.applicationVariables.duration}
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
          {this.props.definition.presentation_properties.map(presProp => {
            return (
              <div key={presProp.name}>
                <InspectorField
                  type={presProp.type}
                  name={presProp.name}
                  key={presProp.name}
                  updateAppVar={this.props.updateAppVar}
                  value={this.props.applicationVariables[presProp.name]}
                />
              </div>
            );
          })}
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

Inspector.propTypes = {
  definition: React.PropTypes.object.isRequired,
  submitAppVars: React.PropTypes.func.isRequired,
  updateAppVar: React.PropTypes.func.isRequired,
  applicationVariables: React.PropTypes.object.isRequired,
};

export default Inspector;
