import React from 'react';
import Inspector from './Inspector';

const inspectorStyle = {
  float: 'right',
  width: '24.5%',
  height: '100vh',
};

const appStyle = {
  borderSize: '1px',
  borderStyle: 'solid',
  borderColor: 'black',
  float: 'left',
  width: '75%',
  height: '100vh',
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
    const App = this.props.app;
    if (this.state.submit) {
      return (
        <div className="simulator">
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
        <div className="simulator">
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

Simulator.propTypes = {
  definition: React.PropTypes.object.isRequired,
  app: React.PropTypes.func.isRequired,
};

export default Simulator;
