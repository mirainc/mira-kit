// MARK: Imports
import React from 'react';
import ReactDOM from 'react-dom';
import MessageCourier from '../foundation/message_courier.jsx';


class App extends React.Component {
  // MARK: Properties
  props: {
    source: string
  }

  state: {
    rootContainerClass?: Class
  }

  initialHeartbeat: number = -1

  // MARK: Constructors
  constructor(props) {
    super(props);
    const state = {
      rootContainerClass: eval(props.source).default,
    };

    this.state = state;

    // bind responders
    this.onHeartbeat = this.onHeartbeat.bind(this);
    MessageCourier.defaultCourier().subscribeToMessage(
      'heartbeat',
      this.onHeartbeat
    );
  }

  // MARK: Rendering
  render(): any {
    return React.createElement(this.state.rootContainerClass, {
      ref: 'rootContainer',
      ...this.props.appVariables
    });
  }

  // MARK: Lifecycle
  componentDidMount() {
    window.addEventListener('message', this.onWindowMessage, false);
  }

  componentDidReceiveHeartbeat(beat: number) {
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

  // MARK: Responders
  onHeartbeat(payload: Object) {
    this.componentDidReceiveHeartbeat(payload.beat);
  }

  // MARK: Main
  static main(source: string, applicationVariables: Object) {
    // unset sandbox values
    // if (window.parent !== undefined) {
    //   window.parent = this.captureSandboxFailure('parent');
    // }
    //
    // if (window.XMLHttpRequest !== undefined) {
    //   window.XMLHttpRequest = this.captureSandboxFailure(
    //     'XMLHttpRequest',
    //     'mira-kit.MiraResource'
    //   );
    // }
    //
    // if (window.fetch !== undefined) {
    //   fetch = this.captureSandboxFailure(
    //     'fetch',
    //     'mira-kit.MiraResource'
    //   );
    // }

    // set sandbox values
    if (window.React === undefined) {
      window.React = React;
    }

    ReactDOM.render(
      <App source={source} appVariables={applicationVariables}/>,
      document.getElementById('root')
    );
  }

  static captureSandboxFailure(value: string, fallback: ?string): () => void {
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


// MARK: Exports
window.App = App;
export default App;
