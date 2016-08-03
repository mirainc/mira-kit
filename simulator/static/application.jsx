// MARK: Imports
import React from 'react';
import ReactDOM from 'react-dom';


class App extends React.Component {
  // MARK: Properties
  initialHeartbeat = -1

  // MARK: Constructor
  constructor(props) {
    super(props);

    let beat = 0;
    setInterval(() => {
      this.componentDidReceiveHeartbeat(beat++);
    }, 100);
  }

  // MARK: Rendering
  render() {
    return React.createElement(window.rootContainerClass, {
      ref: 'rootContainer'
    });
  }

  // MARK: Lifecycle
  componentDidReceiveHeartbeat(beat) {
    if (this.initialHeartbeat === -1) {
      this.initialHeartbeat = beat;
    }

    const offsetBeat = beat - this.initialHeartbeat;
    const propagateHeartbeat = (
      this.refs.rootContainer &&
      this.refs.rootContainer.componentDidReceiveHeartbeat
    );

    if (propagateHeartbeat) {
      this.refs.rootContainer.componentDidReceiveHeartbeat(offsetBeat);
    }
  }

  // MARK: Main
  static main() {
    // unset sandbox values
    parent = this.captureSandboxFailure('parent');
    XMLHttpRequest = this.captureSandboxFailure(
      'XMLHttpRequest',
      'mira-kit.MiraResource'
    );

    if (window.fetch !== undefined) {
      fetch = this.captureSandboxFailure(
        'fetch',
        'mira-kit.MiraResource'
      );
    }

    ReactDOM.render(
      <App/>,
      document.getElementById('root')
    );
  }

  static captureSandboxFailure(value, fallback) {
    return () => {
      let reason = `${value} is unavailable in the Mira sandbox.`;
      if (fallback) {
        reason += ` Use ${fallback} instead.`;
      }

      console.warn(reason);
      return undefined;
    };
  }
}


App.main();
