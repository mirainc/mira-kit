import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ErrorMessage from './ErrorMessage';

export const ERROR_DISPLAY_TIME = 5000;

const miraAppIdentifier = Symbol();
export const isMiraApp = component => !!component.type[miraAppIdentifier];

export default App => {
  const appName = App.name || App.displayName;

  const WrappedComponent = class extends Component {
    static displayName = `withMiraApp(${appName || 'App'})`;

    static propTypes = {
      miraEvents: PropTypes.shape({
        on: PropTypes.func.isRequired,
        emit: PropTypes.func.isRequired,
      }).isRequired,
      miraFileResource: PropTypes.func.isRequired,
      miraWebResource: PropTypes.func.isRequired,
      strings: PropTypes.object,
    };

    state = {
      didReceivePlay: false,
      error: null,
    };

    hasSentReady = false;

    componentDidMount() {
      this.props.miraEvents.on('play', () => {
        if (this.state.error) {
          // An error occurred before we received the play event, delay
          // the presentation_complete event to allow photon enough time
          // to queue the next presentation.
          this.playerEndTimeout = setTimeout(
            this.handlePresentationComplete,
            ERROR_DISPLAY_TIME,
          );
        }

        if (this.state.didReceivePlay) {
          // When there is a single presentation, play will be fired again on complete.
          // We need to toggle didReceivePlay so that the presentation loops.
          this.setState({ didReceivePlay: false }, () => {
            this.setState({ didReceivePlay: true });
          });
        } else {
          this.setState({ didReceivePlay: true });
        }
      });
    }

    handlePresentationReady = () => {
      // Emit presentation_ready after fetching initial resources.
      // Applications are preloaded before switching to the next
      // presentation and this will notify the device when it is
      // ready to become the active presentation.
      if (!this.hasSentReady) {
        this.props.miraEvents.emit('presentation_ready');
        this.hasSentReady = true;
      }
    };

    handlePresentationComplete = () => {
      // All apps must emit a presentation_complete event to trigger the
      // next presentation to run. This could be after a video end event,
      // a user-defined duration from application variables, an error, etc...
      this.props.miraEvents.emit('presentation_complete');
    };

    handlePresentationError = error => {
      // Fire presentation complete immediately if we are the active
      // presentation (already received the play event). Otherwise, fire
      // presentation_ready and wait until we receive the play event.
      if (this.state.didReceivePlay) {
        this.handlePresentationComplete();
      } else {
        // Only show the error if the app hasn't fired presentation_ready before
        // an error occurs.
        this.setState({ error });
        this.handlePresentationReady();
      }

      console.error(
        `App ${appName ? `'${appName}' ` : ''}errored: ${error.message}`,
      );
    };

    render() {
      const { error, didReceivePlay } = this.state;

      if (error) {
        return (
          <ErrorMessage
            title="Sorry, unable to display this content."
            message={error.message}
          />
        );
      }

      const {
        miraEvents,
        miraFileResource,
        miraWebResource,
        strings,
        ...appProps
      } = this.props;

      return (
        <App
          {...appProps}
          shouldPlay={didReceivePlay}
          onReady={this.handlePresentationReady}
          onComplete={this.handlePresentationComplete}
          onError={this.handlePresentationError}
          miraFileResource={miraFileResource}
          miraWebResource={miraWebResource}
          strings={strings}
        />
      );
    }
  };

  WrappedComponent[miraAppIdentifier] = true;

  return WrappedComponent;
};
