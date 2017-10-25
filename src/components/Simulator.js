import React from 'react';
import PropTypes from 'prop-types';
import events from 'events';
import Frame from 'react-frame-component';
import LocalizedStrings from 'react-localization';
import Inspector from './Inspector';
import AppContainer from './AppContainer';
import { valAppVars, initAppVars, valDuration, valStrings } from '../helpers';
import requestProxy from '../requestProxy';
import {
  inspectorStyle,
  simulatorStyle,
  appStyle,
  unRenderedAppStyle,
} from '../styles';

const propTypes = {
  definition: PropTypes.object.isRequired,
  App: PropTypes.func.isRequired,
};

class Simulator extends React.Component {
  constructor(props) {
    super();
    // set initial variables
    this.miraEvents = new events.EventEmitter();
    this.timeout = null;
    const {
      presentation_properties: presentationProperties,
      allowed_request_domains: allowedRequestDomains,
      strings,
      default_duration: defaultDuration,
    } = props.definition;

    // Note: Create localized strings only need to run this at start
    this.strings = new LocalizedStrings(strings);

    // Validate required strings values exist
    valStrings(this.strings);
    // getInitialState
    const initVals = initAppVars(presentationProperties);

    // create the request proxy
    const rProxy = requestProxy(allowedRequestDomains);
    this.miraRequestResource = rProxy.miraRequestResource;
    this.miraFileResource = rProxy.miraFileResource;

    this.state = {
      submit: false,
      presPropToAppVarMap: initVals.presPropToAppVarMap,
      unPublishedApplicationVariables: initVals.defaultAppVars,
      publishedApplicationVariables: {},
      duration: defaultDuration,
    };
    this.submitAppVars = this.submitAppVars.bind(this);
    this.updateAppVar = this.updateAppVar.bind(this);
    this.updateDuration = this.updateDuration.bind(this);
    this.clearApp = this.clearApp.bind(this);
    this.createTimeout = this.createTimeout.bind(this);
    this.initEventEmitter = this.initEventEmitter.bind(this);
    this.runApplication = this.runApplication.bind(this);
    this.renderInspector = this.renderInspector.bind(this);
  }

  // clear simulator
  clearApp() {
    const { miraEvents, timeout } = this;
    // clear any listeners and timeouts for application and simulator
    miraEvents.removeAllListeners();
    if (timeout) {
      clearTimeout(timeout);
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
    const { props, miraEvents, clearApp } = this;
    const { lifecycle_events: lifeCycleEvents } = props.definition;
    lifeCycleEvents.forEach(e => {
      if (e === 'presentation_ready') {
        miraEvents.on(e, () => {
          console.log('Mira Kit received presentation_ready, emitting play');
          miraEvents.emit('play');
        });
      } else if (e === 'presentation_complete') {
        miraEvents.on(e, () => {
          console.log('Mira Kit received presentation_complete');
          clearApp();
        });
      } else {
        this.miraEvents.on(e, () => {
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
    // only empty strings delete value
    if (value !== '') {
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
    const { props, state, runApplication } = this;
    const {
      configurable_duration: configurableDuration,
      presentation_properties: presentationProperties,
    } = props.definition;
    const {
      presPropToAppVarMap,
      unPublishedApplicationVariables,
      duration,
    } = state;

    // set state
    const newAppVars = { ...unPublishedApplicationVariables };

    // valiate everything
    valDuration(duration, configurableDuration);
    valAppVars(newAppVars, presentationProperties, presPropToAppVarMap);

    // run application
    runApplication(newAppVars, configurableDuration, duration);
  }

  renderInspector() {
    const {
      submitAppVars,
      updateAppVar,
      props,
      state,
      updateDuration,
      strings,
    } = this;
    const { definition } = props;
    const { unPublishedApplicationVariables, duration, submit } = state;
    return (
      <Frame className="Inspector" style={inspectorStyle}>
        <Inspector
          submitAppVars={submitAppVars}
          definition={definition}
          updateAppVar={updateAppVar}
          applicationVariables={unPublishedApplicationVariables}
          duration={duration}
          updateDuration={updateDuration}
          submit={submit}
          strings={strings}
        />
      </Frame>
    );
  }
  render() {
    const {
      state,
      miraEvents,
      miraFileResource,
      miraRequestResource,
      strings,
      renderInspector,
    } = this;
    const { App } = this.props;
    const { publishedApplicationVariables, submit } = state;
    // show on submit or if playing
    if (submit) {
      return (
        <div className="simulator" style={simulatorStyle}>
          <div className="app" style={appStyle}>
            <AppContainer
              applicationVariables={publishedApplicationVariables}
              miraEvents={miraEvents}
              App={App}
              submit={submit}
              miraRequestResource={miraRequestResource}
              miraFileResource={miraFileResource}
              strings={strings}
            />
          </div>
        </div>
      );
    }
    return (
      <div className="simulator" style={simulatorStyle}>
        <div className="app" style={unRenderedAppStyle} />
        {renderInspector()}
      </div>
    );
  }
}

Simulator.propTypes = propTypes;

export default Simulator;
