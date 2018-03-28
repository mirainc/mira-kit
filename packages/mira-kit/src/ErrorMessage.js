import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string,
};

const defaultProps = {
  message: '',
};

const ErrorMessage = ({ title, message }) => (
  <div style={styles.container}>
    <div style={styles.title}>{title}</div>
    <div style={styles.message}>{message}</div>
  </div>
);

ErrorMessage.propTypes = propTypes;
ErrorMessage.defaultProps = defaultProps;

const styles = {
  container: {
    boxSizing: 'border-box',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    padding: 100,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    backgroundColor: '#22202b',
  },
  title: {
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    fontSize: 72,
    color: '#d6d6d9',
    letterSpacing: -0.6,
    lineHeight: 88 / 72,
    marginTop: 0,
    marginBottom: 50,
  },
  message: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: 36,
    color: '#9897a0',
    letterSpacing: 0,
    lineHeight: 49 / 36,
    marginTop: 0,
    marginBottom: 0,
  },
};

export default ErrorMessage;
