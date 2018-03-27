import { Component } from 'react';
import PropTypes from 'prop-types';

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
