import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withMiraApp } from 'mira-kit';

class App extends Component {
  static propTypes = {
    shouldPlay: PropTypes.bool.isRequired,
    onReady: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    // App-specific props.
    duration: PropTypes.number.isRequired,
  };

  componentDidMount() {
    // Trigger onReady on mount, typically you would do this after
    // performing any required setup before your app becomes visible
    // (ie. fetching remote data or buffering a video).
    this.props.onReady();
  }

  componentWillUpdate(nextProps) {
    // The app is visible or should loop when play changes from false to true.
    if (nextProps.shouldPlay && !this.props.shouldPlay) {
      // Trigger onComplete after a user-defined amount of time.
      this.timeout = setTimeout(
        nextProps.onComplete,
        nextProps.duration * 1000,
      );
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.title}>MiraKit</div>
        <div style={styles.subtitle}>Screen signage SDK</div>
        <br />
        <div>
          For documentation and examples check out{' '}
          <a
            style={styles.anchor}
            href="https://github.com/mirainc/mira-kit"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/mirainc/mira-kit
          </a>.
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    height: '100%',
    padding: 50,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif',
    fontSize: '175%',
    color: 'white',
    background: '#16161d',
    lineHeight: 1.5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: '0.85em',
    letterSpacing: 1.2,
  },
  subtitle: {
    fontStyle: 'italic',
    fontSize: '0.85em',
    opacity: 0.6,
  },
  anchor: {
    color: '#0683d4',
    textDecoration: 'none',
  },
};

export default withMiraApp(App);
