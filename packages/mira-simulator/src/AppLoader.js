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
    }).isRequired,
    onLoad: PropTypes.func.isRequired,
    onComplete: PropTypes.func,
    enableLogs: PropTypes.bool,
    isPresenting: PropTypes.bool,
    isFullscreen: PropTypes.bool,
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

  hasSentInitialPresentation = false;

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
    const { presentation } = this.props;
    if (!this.checkPreviewErrors()) {
      // Send app vars if:
      //  - There are no errors.
      //  - We have not sent the initial app vars since load.
      //  - They have changed.
      if (
        !this.hasSentInitialPresentation ||
        !deepEqual(presentation, prevProps.presentation)
      ) {
        this.messenger.send('presentation', presentation);
        this.hasSentInitialPresentation = true;
      }
      // Only log once.
      if (!this.hasLoggedReady) {
        this.logPending('Waiting for onReady.');
        this.hasLoggedReady = true;
      }
    }
  }

  receiveMessage = (type, payload) => {
    const { isPresenting, onComplete } = this.props;

    if (type === 'init') {
      this.hasSentInitialPresentation = false;
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
