import React from 'react';
import PropTypes from 'prop-types';
import events from 'events';
import Inspector from './Inspector';
import AppContainer from './AppContainer';
import { valAppVars, initAppVars, valDuration } from '../helpers';
import miraRequestProxy from '../requestProxy';

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
    const {
      presentation_properties,
      allowed_request_domains,
    } = props.definition;
    // getInitialState
    const initVals = initAppVars(presentation_properties);

    // create the request proxy
    const requestProxy = miraRequestProxy(allowed_request_domains);
    this.MiraRequestResource = requestProxy.MiraRequestResource;
    this.MiraFileRequestResource = requestProxy.MiraFileRequestResource;

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
    this.clearApp = this.clearApp.bind(this);
    this.createTimeout = this.createTimeout.bind(this);
    this.initEventEmitter = this.initEventEmitter.bind(this);
    this.runApplication = this.runApplication.bind(this);
  }

  // clear simulator
  clearApp() {
    // clear any listeners and timeouts for application and simulator
    this.eventEmitter.removeAllListeners();
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.setState({
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
    const lifeCycleEvents = this.props.definition.lifecycle_events;
    lifeCycleEvents.forEach(e => {
      if (e === 'presentation_ready') {
        this.eventEmitter.on(e, () => {
          this.eventEmitter.emit('play');
        });
      } else if (e === 'presentation_complete') {
        this.eventEmitter.on(e, () => {
          this.clearApp();
        });
      } else {
        this.eventEmitter.on(e, () => {
          // eslint-disable-next-line
          console.log(`Application Emitted ${e}`);
        });
      }
    });
  }

  runApplication(appVars, configDuration, duration) {
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
    if (value) {
      newAppVars[name] = value;
    } else {
      // if the value is removed then remove key from app vars
      delete newAppVars[name];
    }
    this.setState({
      unPublishedApplicationVariables: newAppVars,
    });
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
  render() {
    const { App } = this.props;
    const { publishedApplicationVariables, submit } = this.state;
    const eventEmitter = this.eventEmitter;
    // show on submit or if playing
    if (submit) {
      return (
        <div className="simulator" style={simulatorStyle}>
          <div className="app" style={appStyle}>
            <AppContainer
              applicationVariables={publishedApplicationVariables}
              eventEmitter={eventEmitter}
              App={App}
              submit={submit}
              MiraRequestResource={this.MiraRequestResource}
              MiraFileRequestResource={this.MiraFileRequestResource}
            />
          </div>
          {this.renderInspector()}
        </div>
      );
    }
    return (
      <div className="simulator" style={simulatorStyle}>
        <div className="app" style={appStyle} />
        {this.renderInspector()}
      </div>
    );
  }
}

Simulator.propTypes = propTypes;

export default Simulator;
