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

  state = {
    presentation: null,
  };

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
    } else if (type === 'presentation') {
      this.setState({ presentation: payload });
    }
  };

  render() {
    const { allowedRequestDomains, children } = this.props;
    const { presentation } = this.state;
    // Don't render the app if we haven't received the presentation object yet.
    if (!presentation) return null;
    // Spreading app props will be deprecated. New apps should use the presentation
    // prop which contains the application variables.
    const legacyApplicationVars = presentation.application_vars;

    const props = {
      ...legacyApplicationVars,
      presentation,
      miraEvents: this.miraEvents,
      miraFileResource: createFileResource(this.privateFetch),
      miraRequestResource: createRequestResource(
        this.privateFetch,
        allowedRequestDomains,
      ),
    };

    return children(props);
  }
}

export default AppPreview;
