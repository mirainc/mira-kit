import PropTypes from 'prop-types';
import { Component } from 'react';

class PresentationSkipper extends Component {
  static propTypes = {
    onComplete: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.props.onComplete();
  }

  render() {
    return null;
  }
}

export default PresentationSkipper;
