import React from 'react';
import Inspector from './Inspector';
import AppContainer from './AppContainer';
import PropTypes from 'prop-types';
import { valAppVars, initAppVars, valDuration } from '../helpers';
import events from 'events';

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

const appStyle = {
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
    // set initial variables
    this.eventEmitter = new events.EventEmitter();
    this.timeout = null;
    //getInitialState
    const initVals = initAppVars(props.definition.presentation_properties);
    this.state = {
      submit: false,
      isPlaying: false,
      presPropToAppVarMap: initVals.presPropToAppVarMap,
      unPublishedApplicationVariables: initVals.defaultAppVars,
      publishedApplicationVariables: {},
      duration: props.definition.default_duration,
    };
    this.submitAppVars = this.submitAppVars.bind(this);
    this.updateAppVar = this.updateAppVar.bind(this);
    this.updateDuration = this.updateDuration.bind(this);
    this.clearApp = this.clearApp.bind(this);
    this.createTimeout = this.createTimeout.bind(this);
    this.initEventEmitter = this.initEventEmitter.bind(this);
    this.runApplication = this.runApplication.bind(this);
  }

  // clear simulator
  clearApp() {
    // clear any listeners and timeouts
    this.eventEmitter.removeAllListeners();
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.setState({
      isPlaying: false,
      submit: false,
    });
  }

  // Sets a timeout for a configurable duration application
  createTimeout(duration) {
    // Set timeout for duration to flip submit to false
    this.timeout = setTimeout(() => {
      this.clearApp();
    }, duration * 1000);
  }

  // sets up the event emitter for the simulator
  initEventEmitter() {
    // re-initialize all listeners
    this.eventEmitter.on('presentation_ready', () => {
      console.log('Application ready to show');
      console.log('Emitting play');
      this.eventEmitter.emit('play');
    });
    this.eventEmitter.on('presentation_complete', () => {
      console.log('Presentation completed');
      console.log('Clearing presentation');
      this.clearApp();
    });
  }

  runApplication(appVars, configDuration, duration) {
    // clear app if running
    if (this.state.isPlaying === true) this.clearApp();
    // setup event emitter and timeout
    this.initEventEmitter();
    if (configDuration) this.createTimeout(duration);
    // after event emitter and timeout are setup, mark as playing
    this.setState({
      submit: true,
      publishedApplicationVariables: appVars,
    });
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
          submit={this.state.submit}
        />
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
    const duration = valDuration(this.state.duration, configDuration);
    valAppVars(newAppVars, presProps, presToAppMap);

    // run application
    this.runApplication(newAppVars, configDuration, duration);
  }

  render() {
    const { App } = this.props;
    const { publishedApplicationVariables, submit, isPlaying } = this.state;
    const eventEmitter = this.eventEmitter;
    // show on submit or if playing
    if (submit || isPlaying) {
      console.log(this.state);
      return (
        <div className="simulator" style={simulatorStyle}>
          <div className="app" style={appStyle}>
            <AppContainer
              applicationVariables={publishedApplicationVariables}
              eventEmitter={eventEmitter}
              App={App}
              submit={submit}
            />
          </div>
          {this.renderInspector()}
        </div>
      );
    } else {
      return (
        <div className="simulator" style={simulatorStyle}>
          <div className="app" style={appStyle} />
          {this.renderInspector()}
        </div>
      );
    }
  }
}

Simulator.propTypes = propTypes;

export default Simulator;
