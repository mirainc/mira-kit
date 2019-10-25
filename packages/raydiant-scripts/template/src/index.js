import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRaydiantApp } from 'raydiant-kit';
import './styles.css';

class App extends Component {
  static propTypes = {
    presentation: PropTypes.shape({
      values: PropTypes.shape({
        duration: PropTypes.number.isRequired,
      }),
    }).isRequired,
    isPlaying: PropTypes.bool.isRequired,
    onReady: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
  };

  componentDidMount() {
    // Trigger onReady on mount, typically you would do this after
    // performing any required setup before your app becomes visible
    // (ie. fetching remote data or buffering a video).
    this.props.onReady();
  }

  componentDidUpdate(prevProps) {
    const { isPlaying, presentation, onComplete } = this.props;
    const { duration } = presentation.values;
    // The app is visible start the onComplete timeout.
    if (isPlaying && !this.onCompleteTimeout) {
      this.onCompleteTimeout = setTimeout(onComplete, duration * 1000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.onCompleteTimeout);
  }

  render() {
    return (
      <main>
        <h1>MiraKit</h1>
        <h2>Screen signage SDK</h2>
        <p>
          For documentation and examples check out{' '}
          <a
            href="https://github.com/mirainc/raydiant-kit"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/mirainc/raydiant-kit
          </a>.
        </p>
      </main>
    );
  }
}

export default withRaydiantApp(App);
