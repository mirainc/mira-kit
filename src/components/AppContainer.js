/* Used to wrap the application object.
 * Ensures application only updates on submit state change
 */
import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  miraEvents: PropTypes.object.isRequired,
  applicationVariables: PropTypes.object.isRequired,
  App: PropTypes.func.isRequired,
  submit: PropTypes.bool.isRequired,
  miraRequestResource: PropTypes.func.isRequired,
  miraFileResource: PropTypes.func.isRequired,
  strings: PropTypes.object.isRequired,
};

class AppContainer extends React.Component {
  shouldComponentUpdate(nextProps) {
    // Only re-render application on submit change
    const shouldRender =
      this.props.submit === false && nextProps.submit === true;
    return shouldRender;
  }

  render() {
    const {
      App,
      miraEvents,
      applicationVariables,
      miraFileResource,
      miraRequestResource,
      strings,
    } = this.props;
    // Give app a unique key
    const key = new Date().getTime();
    return (
      <App
        {...applicationVariables}
        miraEvents={miraEvents}
        miraRequestResource={miraRequestResource}
        miraFileResource={miraFileResource}
        key={key}
        strings={strings}
      />
    );
  }
}

AppContainer.propTypes = propTypes;
AppContainer.defaultProps = { submit: false };

export default AppContainer;
