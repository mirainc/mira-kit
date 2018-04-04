import PropTypes from 'prop-types';
import React, { Component } from 'react';
import createMessenger from './createMessenger';

class AppLoader extends Component {
  static propTypes = {
    appVars: PropTypes.object.isRequired,
    onLoad: PropTypes.func.isRequired,
    onComplete: PropTypes.func,
    enableLogs: PropTypes.bool,
    isPresenting: PropTypes.bool,
    previewErrors: PropTypes.arrayOf(
      PropTypes.shape({ message: PropTypes.string }),
    ),
  };

  static defaultProps = {
    onComplete: null,
    enableLogs: true,
    isPresenting: false,
    previewErrors: [],
  };

  state = {
    didReceiveReady: false,
  };

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

  componentDidUpdate() {
    const hasErrors = this.checkPreviewErrors();
    if (!hasErrors) {
      // Don't send app var updates if they aren't valid.
      // We only do this on update because never have the correct
      // app vars on mount.
      this.messenger.send('application_variables', this.props.appVars);
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
      this.props.onLoad(payload.application, payload.applicationVariables);
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
    this.log(`⚠️%c${message}`, 'color:#f8b91c');
  }

  logPending(message) {
    this.log(`⬜️%c${message}`, 'color:#a5a5a5');
  }

  logSuccess(message) {
    this.log(`✅%c${message}`, 'color:#41984d');
  }

  log(...args) {
    if (this.props.enableLogs) {
      console.log(...args);
    }
  }

  render() {
    const shouldShowOverlay = !this.state.didReceiveReady;
    return (
      <div style={styles.container}>
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16161D',
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
