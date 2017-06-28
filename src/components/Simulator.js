import React from 'react';
import Inspector from './Inspector';
import PropTypes from 'prop-types';

const inspectorStyle = {
  height: '100vh',
  width: '25%',
};

const simulatorStyle = {
  display: 'flex',
}

const appStyle = {
  borderSize: '1px',
  borderStyle: 'solid',
  borderColor: 'black',
  height: '100vh',
  width: '75%',
};

const propTypes = {
  definition: PropTypes.object.isRequired,
  App: PropTypes.func.isRequired,
};

class Simulator extends React.Component {
  constructor() {
    super();
    //getInitialState
    this.state = {
      submit: false,
      applicationVariables: {},
    };
    this.submitAppVars = this.submitAppVars.bind(this);
    this.updateAppVar = this.updateAppVar.bind(this);
  }

  updateAppVar(name, value) {
    const newAppVars = { ...this.state.applicationVariables };
    newAppVars[name] = value;
    this.setState({
      applicationVariables: newAppVars,
    });
  }

  submitAppVars(appVars) {
    // set state
    this.setState({
      submit: true,
      applicationVariables: appVars,
    });
  }

  render() {
    const { App } = this.props;
    if (this.state.submit) {
      return (
        <div className="simulator" style={simulatorStyle}>
          <div className="app" style={appStyle}>
            <App {...this.state.applicationVariables} />
          </div>
          <div className="Inspector" style={inspectorStyle}>
            <Inspector
              submitAppVars={this.submitAppVars}
              definition={this.props.definition}
              updateAppVar={this.updateAppVar}
              applicationVariables={this.state.applicationVariables}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="simulator" style={simulatorStyle}>
          <div className="app" style={appStyle}>
            placeholder for app
          </div>
          <div className="Inspector" style={inspectorStyle}>
            <Inspector
              submitAppVars={this.submitAppVars}
              definition={this.props.definition}
              updateAppVar={this.updateAppVar}
              applicationVariables={this.state.applicationVariables}
            />
          </div>
        </div>
      );
    }
  }
}

Simulator.propTypes = propTypes;

export default Simulator;
