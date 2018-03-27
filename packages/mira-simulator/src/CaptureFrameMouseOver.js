import { Component } from 'react';
import PropTypes from 'prop-types';

// The app is loaded in an iframe using react-frame-component.
// Events that happen in iframes aren't propagated to the parent.
// react-frame-component only exposes the window through context.
// This component detects a mouse mouve events that happen in the
// iframe and propagates them to the parent.
export default class CaptureFrameMouseOver extends Component {
  static propTypes = {
    onMouseOver: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  };

  static contextTypes = {
    window: PropTypes.any,
  };

  componentDidMount() {
    this.context.window.addEventListener(
      'mousemove',
      this.props.onMouseOver,
      false,
    );
  }

  componentWillUnmount() {
    this.context.window.removeEventListener(
      'mousemove',
      this.props.onMouseOver,
    );
  }

  render() {
    return this.props.children;
  }
}
