import React from 'react';
import Inspector from './Inspector';
import PropTypes from 'prop-types';
import { valAppVars, initAppVars } from '../helpers';

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
    };
    this.submitAppVars = this.submitAppVars.bind(this);
    this.updateAppVar = this.updateAppVar.bind(this);
  }

  updateAppVar(name, value) {
    const newAppVars = { ...this.state.unPublishedApplicationVariables };
    newAppVars[name] = value;
    this.setState({
      unPublishedApplicationVariables: newAppVars,
    });
  }

  // On submit, set the app vars passed in by the simulator to the ones in the Inspector
  submitAppVars() {
    const presProps = this.props.definition.presentation_properties;
    const presToAppMap = this.state.presPropToAppVarMap;
    // set state
    const newAppVars = { ...this.state.unPublishedApplicationVariables };
    valAppVars(newAppVars, presProps, presToAppMap);
    this.setState({
      ...this.state,
      submit: true,
      publishedApplicationVariables: newAppVars,
    });
  }

  render() {
    const { App } = this.props;
    if (this.state.submit) {
      return (
        <div className="simulator" style={simulatorStyle}>
          <div className="app" style={loadedAppStyle}>
            <App {...this.state.publishedApplicationVariables} />
          </div>
          <div className="Inspector" style={inspectorStyle}>
            <Inspector
              submitAppVars={this.submitAppVars}
              definition={this.props.definition}
              updateAppVar={this.updateAppVar}
              applicationVariables={this.state.unPublishedApplicationVariables}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="simulator" style={simulatorStyle}>
          <div className="app" style={unLoadedAppStyle} />
          <div className="Inspector" style={inspectorStyle}>
            <Inspector
              submitAppVars={this.submitAppVars}
              definition={this.props.definition}
              updateAppVar={this.updateAppVar}
              applicationVariables={this.state.unPublishedApplicationVariables}
            />
          </div>
        </div>
      );
    }
  }
}

Simulator.propTypes = propTypes;

export default Simulator;
