import deepEqual from 'fast-deep-equal';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import createMessenger from './createMessenger';
import logger from './logger';

class AppLoader extends Component {
  static propTypes = {
    presentation: PropTypes.shape({
      name: PropTypes.string,
      application_vars: PropTypes.object,
      updated_at: PropTypes.string,
      created_at: PropTypes.string,
      application_deployment_id: PropTypes.string,
      application_id: PropTypes.string,
      application_name: PropTypes.string,
    }).isRequired,
    theme: PropTypes.object,
    selectedPaths: PropTypes.arrayOf(PropTypes.array),
    onLoad: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired,
    onPresentationProperties: PropTypes.func.isRequired,
    enableLogs: PropTypes.bool,
    isPresenting: PropTypes.bool,
    isFullscreen: PropTypes.bool,
    auth: PropTypes.shape({
      accessToken: PropTypes.string,
    }),
    previewErrors: PropTypes.arrayOf(
      PropTypes.shape({ message: PropTypes.string }),
    ),
  };

  static defaultProps = {
    onComplete: null,
    enableLogs: true,
    isPresenting: false,
    isFullscreen: false,
    previewErrors: [],
  };

  state = {
    didReceiveReady: false,
  };

  hasSentInitialProps = false;

  componentDidMount() {
    this.messenger = createMessenger(
      window,
      this.frame.contentWindow,
      this.receiveMessage,
    );

    this.checkPreviewErrors();
  }

  componentWillUnmount() {
    this.messenger.unlisten();
  }

  componentDidUpdate(prevProps) {
    const { presentation, theme, auth, selectedPaths } = this.props;
    if (!this.checkPreviewErrors()) {
      // Send app vars if:
      //  - There are no errors.
      //  - We have not sent the initial app vars since load.
      //  - They have changed.
      if (
        !this.hasSentInitialProps ||
        !deepEqual(presentation, prevProps.presentation) ||
        !deepEqual(auth, prevProps.auth)
      ) {
        this.messenger.send('props', {
          presentation: { ...presentation, theme },
          auth,
          selectedPaths,
        });
        this.hasSentInitialProps = true;
      }
      // Only log once.
      if (!this.hasLoggedReady) {
        this.logPending('Waiting for onReady.');
        this.hasLoggedReady = true;
      }
    }

    if (!deepEqual(selectedPaths, prevProps.selectedPaths)) {
      this.messenger.send('selectedPaths', selectedPaths);
    }
  }

  receiveMessage = (type, payload) => {
    const { isPresenting, onComplete, onPresentationProperties } = this.props;

    if (type === 'init') {
      this.hasSentInitialProps = false;
      this.props.onLoad(payload.appVersion, payload.simulatorOptions);
    } else if (type === 'presentation_ready') {
      this.logSuccess('onReady received.');
      this.logPending('Waiting for onComplete.');
      this.setState({ didReceiveReady: true });
      setTimeout(() => this.messenger.send('play'));
    } else if (type === 'presentation_complete') {
      if (isPresenting) {
        // Call onComplete to trigger the next presentation.
        this.logSuccess('onComplete received, play next.');
        onComplete();
      } else {
        // Trigger play again to loop the presentation.
        this.logSuccess('onComplete received, play again.');
        setTimeout(() => this.messenger.send('play'));
      }
    } else if (type === 'presentation_properties') {
      onPresentationProperties(payload);
    }
  };

  checkPreviewErrors() {
    const { previewErrors, isPresenting, onComplete } = this.props;
    const hasErrors = previewErrors.length > 0;

    if (hasErrors) {
      const message = previewErrors[0].message;
      // Don't render the same warning consecutively.
      if (message !== this.previewWarning) {
        this.logWarning(`Warning: ${message}`);
      }
      this.previewWarning = message;
      // Skip presentation if presenting.
      if (isPresenting) {
        onComplete();
      }
    } else {
      this.previousWarning = null;
    }

    return hasErrors;
  }

  logWarning(message) {
    if (this.props.enableLogs) {
      logger.warning(message);
    }
  }

  logPending(message) {
    if (this.props.enableLogs) {
      logger.pending(message);
    }
  }

  logSuccess(message) {
    if (this.props.enableLogs) {
      logger.success(message);
    }
  }

  render() {
    const { isFullscreen } = this.props;
    const { didReceiveReady } = this.state;
    const shouldShowOverlay = !didReceiveReady;
    return (
      <div style={isFullscreen ? styles.containerFullscreen : styles.container}>
        {shouldShowOverlay && <div style={styles.overlay} />}
        <iframe
          title="Preview"
          src="preview/index.html"
          ref={frame => {
            this.frame = frame;
          }}
          style={styles.frame}
        />
      </div>
    );
  }
}

const styles = {
  container: {
    height: '100%',
    position: 'relative',
  },
  containerFullscreen: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 90, // Should be less than zIndex of controls
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22202b',
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 40,
  },
  frame: {
    width: '100%',
    height: '100%',
    border: 0,
  },
};

export default AppLoader;
