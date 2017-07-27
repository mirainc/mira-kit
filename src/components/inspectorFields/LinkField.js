import React from 'react';
import PropTypes from 'prop-types';
import validUrl from 'valid-url';

const propTypes = {
  presentationProperty: PropTypes.object.isRequired,
};

const LinkField = props => {
  const presentationProperty = props.presentationProperty;
  const name = presentationProperty.name;
  const url = presentationProperty.url;
  if (validUrl.isUri(url)) {
    return (
      <a href={url} target="_blank">
        {name}
      </a>
    );
  }
  throw new Error(`Invalid URL: ${url} is not a valid url`);
};

LinkField.propTypes = propTypes;

export default LinkField;
