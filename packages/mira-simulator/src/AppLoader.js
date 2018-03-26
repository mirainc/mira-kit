import EventEmitter from 'eventemitter3';
import PropTypes from 'prop-types';
import { createFileResource, createRequestResource } from 'mira-resources';
import React, { Component } from 'react';
import Frame from 'react-frame-component';

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

class AppLoader extends Component {
  static propTypes = {
    allowedRequestDomains: PropTypes.arrayOf(PropTypes.string).isRequired,
    appVars: PropTypes.object.isRequired,
    children: PropTypes.func.isRequired,
  };

  miraEvents = new EventEmitter();
  miraFileResource = createFileResource(window);

  state = {
    didReceiveReady: false,
  };

  componentWillMount() {
    this.miraEvents.on('presentation_ready', () => {
      this.setState({ didReceiveReady: true });
      setTimeout(() => this.miraEvents.emit('play'));
    });

    this.miraEvents.on('presentation_complete', () => {
      // Loop the presentation.
      // TODO: How can we detect failures to call onComplete?
      this.miraEvents.emit('play');
    });
  }

  render() {
    const shouldShowOverlay = !this.state.didReceiveReady;
    return (
      <div style={styles.container}>
        {shouldShowOverlay && <div style={styles.overlay} />}
        <Frame head={<style>{runtimeCss}</style>} style={styles.frame}>
          {this.props.children({
            ...this.props.appVars,
            miraEvents: this.miraEvents,
            miraFileResource: this.miraFileResource,
            miraRequestResource: createRequestResource(
              window,
              this.props.allowedRequestDomains,
            ),
          })}
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
