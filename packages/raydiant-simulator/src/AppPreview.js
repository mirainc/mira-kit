import PropTypes from 'prop-types';
import { Component } from 'react';
import { createFileResource, createRequestResource } from 'raydiant-resources';
import createMessenger from './createMessenger';
import { EventEmitter } from 'eventemitter3';

class AppPreview extends Component {
  static propTypes = {
    appVersion: PropTypes.object.isRequired,
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
    // miraRequestResource and miraFileResource are deprecated, we can
    // remove privateFetch after they are finally removed.
    this.privateFetch = window.fetch.bind(window);
  }

  componentDidMount() {
    const { appVersion, simulatorOptions } = this.props;

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

    // Send the appVersion definition and all app variables to the parent window.
    this.messenger.send('init', {
      appVersion,
      simulatorOptions,
    });
  }

  componentWillUnmount() {
    this.messenger.unlisten();
  }

  receiveMessage = (type, payload) => {
    if (type === 'play') {
      this.miraEvents.emit('play');
    } else if (type === 'props') {
      this.setState({
        presentation: payload.presentation,
        auth: payload.auth,
      });
    }
  };

  render() {
    const { allowedRequestDomains, children, simulatorOptions } = this.props;
    const { presentation, auth } = this.state;
    // Don't render the app if we haven't received the presentation object yet.
    if (!presentation) return null;
    // Spreading app props will be deprecated. New apps should use the presentation
    // prop which contains the application variables.
    const legacyApplicationVars = presentation.application_vars;

    const props = {
      ...legacyApplicationVars,
      presentation,
      auth,
      miraEvents: this.miraEvents,
      miraFileResource: createFileResource(this.privateFetch),
      // TODO: Remove config.allowedRequestDomains when miraRequestResource is finally removed.
      miraRequestResource: createRequestResource(
        this.privateFetch,
        allowedRequestDomains,
      ),
      isDashboard: simulatorOptions.isDashboard,
      isThumbnail: simulatorOptions.isThumbnail,
    };

    return children(props);
  }
}

export default AppPreview;
