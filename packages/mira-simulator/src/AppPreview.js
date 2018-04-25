import PropTypes from 'prop-types';
import { Component } from 'react';
import {
  createFileResource,
  createRequestResource,
  captureSandboxFailure,
} from 'mira-resources';
import createMessenger from './createMessenger';
import { EventEmitter } from 'eventemitter3';

class AppPreview extends Component {
  static propTypes = {
    application: PropTypes.object.isRequired,
    allowedRequestDomains: PropTypes.arrayOf(PropTypes.string),
    simulatorOptions: PropTypes.object,
  };

  static defaultProps = {
    allowedRequestDomains: [],
    simulatorOptions: { presentations: [] },
  };

  state = {};
  miraEvents = new EventEmitter();

  componentWillMount() {
    // Private fetch used for fetching in mira resources.
    this.privateFetch = window.fetch.bind(window);

    // Clobber XMLHttpRequest because it is not available in the Mira sandbox.
    window.XMLHttpRequest = captureSandboxFailure(
      'XMLHttpRequest',
      'miraRequestResource',
    );

    // Clobber fetch because it is not available on MiraLinks.
    window.fetch = captureSandboxFailure('fetch', 'miraRequestResource');
  }

  componentDidMount() {
    const { application, simulatorOptions } = this.props;

    this.messenger = createMessenger(
      window,
      window.parent,
      this.receiveMessage,
    );

    // Forward presentation events to the parent window.
    ['presentation_ready', 'presentation_complete'].forEach(eventName => {
      this.miraEvents.on(eventName, () => {
        this.messenger.send(eventName);
      });
    });

    // Send the application definition and all app variables to the parent window.
    this.messenger.send('init', {
      application,
      simulatorOptions,
    });
  }

  componentWillUnmount() {
    this.messenger.unlisten();
  }

  receiveMessage = (type, payload) => {
    if (type === 'play') {
      this.miraEvents.emit('play');
    } else if (type === 'application_variables') {
      this.setState({ appVars: payload });
    }
  };

  render() {
    // Don't render the app if we haven't received any app vars yet.
    if (!this.state.appVars) return null;

    const props = {
      ...this.state.appVars,
      miraEvents: this.miraEvents,
      miraFileResource: createFileResource(this.privateFetch),
      miraRequestResource: createRequestResource(
        this.privateFetch,
        this.props.allowedRequestDomains,
      ),
    };

    return this.props.children(props);
  }
}

export default AppPreview;
