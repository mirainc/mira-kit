/* Used to wrap the application object.
 * Ensures application only updates on submit state change
 */
import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  eventEmitter: PropTypes.object.isRequired,
  applicationVariables: PropTypes.object.isRequired,
  App: PropTypes.func.isRequired,
  submit: PropTypes.bool.isRequired,
  markPlaying: PropTypes.func.isRequired,
};

class AppContainer extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    // Only re-render application on submit change from false to true
    console.log(`Next submit: ${nextProps.submit}`);
    console.log(`Current submit: ${this.props.submit}`);
    const shouldRender =
      this.props.submit === false && nextProps.submit === true;
    console.log(`Should render: ${shouldRender}`);
    return shouldRender;
  }

  componentDidMount() {
    // mark that the app rendered and is playing
    this.props.markPlaying();
  }

  render() {
    console.log('calling render');
    const { App, eventEmitter, applicationVariables } = this.props;
    return <App {...applicationVariables} eventEmitter={eventEmitter} />;
  }
}

AppContainer.propTypes = propTypes;
AppContainer.defaultProps = { submit: false };

export default AppContainer;
