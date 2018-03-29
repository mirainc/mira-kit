import PropTypes from 'prop-types';
import React, { Component } from 'react';
import createMessenger from './createMessenger';

class AppLoader extends Component {
  static propTypes = {
    appVars: PropTypes.object.isRequired,
    onLoad: PropTypes.func.isRequired,
    onComplete: PropTypes.func,
    supressLogs: PropTypes.bool,
    isPresenting: PropTypes.bool,
    hasPreviewErrors: PropTypes.bool,
  };

  static defaultProps = {
    onComplete: null,
    supressLogs: false,
    isPresenting: false,
    hasPreviewErrors: false,
  };

  state = {
    didReceiveReady: false,
  };

  componentDidMount() {
    const { isPresenting, hasPreviewErrors, onComplete } = this.props;

    this.messenger = createMessenger(
      window,
      this.frame.contentWindow,
      this.receiveMessage,
    );

    if (hasPreviewErrors && isPresenting) {
      this.log('Skipping presentation...');
      onComplete();
    }
  }

  componentWillUnmount() {
    this.messenger.unlisten();
  }

  componentDidUpdate() {
    const { appVars, isPresenting, hasPreviewErrors, onComplete } = this.props;
    // Don't send app var updates if they aren't valid
    if (!hasPreviewErrors) {
      this.messenger.send('application_variables', appVars);
    }

    if (hasPreviewErrors && isPresenting) {
      this.log('Skipping presentation...');
      onComplete();
    }
  }

  receiveMessage = (type, payload) => {
    const { isPresenting, onComplete } = this.props;

    if (type === 'init') {
      this.props.onLoad(payload.application, payload.applicationVariables);
      this.log('Waiting for onReady to be called...');
    } else if (type === 'presentation_ready') {
      this.log('onReady called ✅');
      this.log('Waiting for onComplete to be called...');
      this.setState({ didReceiveReady: true });
      setTimeout(() => this.messenger.send('play'));
    } else if (type === 'presentation_complete') {
      this.log('onComplete called ✅');
      // Call onComplete if presenting to switch to the next presentation.
      if (isPresenting) {
        this.log('Playing next presentation...');
        onComplete();
      } else {
        this.log('Re-playing current presentation...');
        setTimeout(() => this.messenger.send('play'));
      }
    }
  };

  log(message) {
    if (!this.props.supressLogs) {
      console.info(message);
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
