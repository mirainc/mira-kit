import React from 'react';
import Inspector from './Inspector';
import PropTypes from 'prop-types';
import { valAppVars, initAppVars, valDuration } from '../helpers';

const inspectorStyle = {
  height: '100vh',
  width: '25%',
  borderWidth: '10px',
  borderStyle: 'solid',
  borderColor: 'white',
};

const simulatorStyle = {
  display: 'flex',
};

const loadedAppStyle = {
  height: '100vh',
  width: '75%',
  background: 'black',
};

const unLoadedAppStyle = {
  height: '100vh',
  width: '75%',
  background: 'black',
};

const propTypes = {
  definition: PropTypes.object.isRequired,
  App: PropTypes.func.isRequired,
};

class Simulator extends React.Component {
  constructor(props) {
    super();
    //getInitialState
    const initVals = initAppVars(props.definition.presentation_properties);
    // console.log(initVals);
    this.state = {
      submit: false,
      presPropToAppVarMap: initVals.presPropToAppVarMap,
      unPublishedApplicationVariables: initVals.defaultAppVars,
      publishedApplicationVariables: {},
      duration: props.definition.default_duration,
    };
    this.submitAppVars = this.submitAppVars.bind(this);
    this.updateAppVar = this.updateAppVar.bind(this);
    this.updateDuration = this.updateDuration.bind(this);
  }

  // takes name because it reused number inspectorField
  updateDuration(name, duration) {
    this.setState({
      duration,
    });
  }

  updateAppVar(name, value) {
    const newAppVars = { ...this.state.unPublishedApplicationVariables };
    newAppVars[name] = value;
    this.setState({
      unPublishedApplicationVariables: newAppVars,
    });
  }

  renderInspector() {
    return (
      <div className="Inspector" style={inspectorStyle}>
        <Inspector
          submitAppVars={this.submitAppVars}
          definition={this.props.definition}
          updateAppVar={this.updateAppVar}
          applicationVariables={this.state.unPublishedApplicationVariables}
          duration={this.state.duration}
          updateDuration={this.updateDuration}
        />
      </div>
    );
  }

  simulatorDefaults() {
    return (
      <div className="simulator" style={simulatorStyle}>
        <div className="app" style={unLoadedAppStyle} />
        {this.renderInspector()}
      </div>
    );
  }

  // On submit, set the app vars passed in by the simulator to the ones in the Inspector
  submitAppVars() {
    const presProps = this.props.definition.presentation_properties;
    const presToAppMap = this.state.presPropToAppVarMap;
    const configDuration = this.props.definition.configurable_duration;
    // set state
    const newAppVars = { ...this.state.unPublishedApplicationVariables };
    // valiate everything
    valDuration(this.state.duration, configDuration);
    valAppVars(newAppVars, presProps, presToAppMap);
    console.log(this.state);
    this.setState({
      ...this.state,
      submit: true,
      publishedApplicationVariables: newAppVars,
    });
    if (configDuration) {
      // Set timeout for duration to flip submit to false
      const dur = new Number(this.state.duration);
      setTimeout(() => {
        this.setState({
          ...this.state,
          submit: false,
        });
      }, dur * 1000);
    }
  }

  render() {
    const { App } = this.props;
    if (this.state.submit) {
      return (
        <div className="simulator" style={simulatorStyle}>
          <div className="app" style={loadedAppStyle}>
            <App {...this.state.publishedApplicationVariables} />
          </div>
          {this.renderInspector()}
        </div>
      );
    } else {
      return this.simulatorDefaults();
    }
  }
}

Simulator.propTypes = propTypes;

export default Simulator;
