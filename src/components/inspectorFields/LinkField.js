import React from 'react';
import PropTypes from 'prop-types';
import validUrl from 'valid-url';

const propTypes = {
  presentationProperty: PropTypes.object.isRequired,
  strings: PropTypes.object.isRequired,
};

const LinkField = props => {
  const { presentationProperty, strings } = props;
  const { name, url } = presentationProperty;
  if (validUrl.isUri(url)) {
    return (
      <a href={url} target="_blank">
        {strings[name]}
      </a>
    );
  }
  throw new Error(`Invalid URL: ${url} is not a valid url`);
};

LinkField.propTypes = propTypes;

export default LinkField;
