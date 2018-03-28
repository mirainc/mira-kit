import EventEmitter from 'eventemitter3';
import PropTypes from 'prop-types';
import {
  createFileResource,
  createRequestResource,
  captureSandboxFailure,
} from 'mira-resources';
import React, { Component } from 'react';
import Frame from 'react-frame-component';
import CaptureFrameMouseOver from './CaptureFrameMouseOver';

const runtimeCss = `
html, body, .frame-root, .frame-content { 
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
.frame-content {
  overflow: hidden;
  user-select: none;
  cursor: default;
  border: none;
  display: block;
  position: absolute;
  background-color: black;
}
`;

// Private fetch used for fetching in mira resources.
const privateFetch = window.fetch.bind(window);

// Clobber XMLHttpRequest because it is not available in the Mira sandbox.
window.XMLHttpRequest = captureSandboxFailure(
  'XMLHttpRequest',
  'miraRequestResource',
);

// Clobber fetch because it is not available on MiraLinks
window.fetch = captureSandboxFailure('fetch', 'miraRequestResource');

class AppLoader extends Component {
  static propTypes = {
    allowedRequestDomains: PropTypes.arrayOf(PropTypes.string).isRequired,
    appVars: PropTypes.object.isRequired,
    children: PropTypes.func.isRequired,
    onMouseOver: PropTypes.func.isRequired,
    onComplete: PropTypes.func,
    supressLogs: PropTypes.bool,
  };

  static defaultProps = {
    onComplete: null,
    supressLogs: false,
  };

  miraEvents = new EventEmitter();
  miraFileResource = createFileResource(privateFetch);

  state = {
    didReceiveReady: false,
  };

  componentWillMount() {
    this.log('Waiting for onReady to be called...');
    this.miraEvents.on('presentation_ready', () => {
      this.log('onReady called ✅');
      this.log('Waiting for onComplete to be called...');
      this.setState({ didReceiveReady: true });
      setTimeout(() => this.miraEvents.emit('play'));
    });

    this.miraEvents.on('presentation_complete', () => {
      this.log('onComplete called ✅');
      // Call onComplete if provided, otherwise loop the presentation.
      if (this.props.onComplete) {
        this.log('Playing next presentation...');
        this.props.onComplete();
      } else {
        this.log('Re-playing current presentation...');
        this.miraEvents.emit('play');
      }
    });
  }

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
        <Frame head={<style>{runtimeCss}</style>} style={styles.frame}>
          <CaptureFrameMouseOver onMouseOver={this.props.onMouseOver}>
            {this.props.children({
              ...this.props.appVars,
              miraEvents: this.miraEvents,
              miraFileResource: this.miraFileResource,
              miraRequestResource: createRequestResource(
                privateFetch,
                this.props.allowedRequestDomains,
              ),
            })}
          </CaptureFrameMouseOver>
        </Frame>
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
