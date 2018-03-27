import React from 'react';
import PropTypes from 'prop-types';
import { SvgIcon } from 'mira-elements';

const propTypes = {
  icon: PropTypes.string.isRequired,
};

const icons = {
  fullscreen: {
    path:
      'M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z',
    viewBox: '0 0 24 24',
  },
  fullscreenExit: {
    path:
      'M14,14H19V16H16V19H14V14M5,14H10V19H8V16H5V14M8,5H10V10H5V8H8V5M19,8V10H14V5H16V8H19Z',
    viewBox: '0 0 24 24',
  },
  pause: {
    path: 'M14,19H18V5H14M6,19H10V5H6V19Z',
    viewBox: '0 0 24 24',
  },
  play: {
    path: 'M8,5.14V19.14L19,12.14L8,5.14Z',
    viewBox: '0 0 24 24',
  },
  previous: {
    path: 'M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z',
    viewBox: '0 0 24 24',
  },
  next: {
    path: 'M16,18H18V6H16M6,18L14.5,12L6,6V18Z',
    viewBox: '0 0 24 24',
  },
  stop: {
    path: 'M18,18H6V6H18V18Z',
    viewBox: '0 0 24 24',
  },
};

const Icon = ({ icon }) => {
  const ic = icons[icon];

  return (
    <SvgIcon viewBox={ic.viewBox}>
      <path d={ic.path} />
    </SvgIcon>
  );
};

Icon.propTypes = propTypes;

export default Icon;
