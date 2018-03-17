import { Component } from 'react';
import PropTypes from 'prop-types';
// import { PresentationBuilderFrom, PresentationPreview } from 'mira-elements';

class MiraAppSimulator extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  state = {};

  render() {
    return this.props.children();
  }
}

export default MiraAppSimulator;
