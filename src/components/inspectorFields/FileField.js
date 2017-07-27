import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

const propTypes = {
  presentationProperty: PropTypes.object.isRequired,
  updateAppVar: PropTypes.func.isRequired,
  value: PropTypes.any,
};

const defaultProps = {
  value: null,
};

class FileField extends React.Component {
  handleChange(e) {
    const file = e[0];
    const fileName = file.name;
    const fileUrl = file.preview;
    const value = { name: fileName, url: fileUrl };
    const name = this.props.presentationProperty.name;
    this.props.updateAppVar(name, value);
  }

  render() {
    const { presentationProperty } = this.props;
    const { constraints } = presentationProperty;
    const value = this.props.value.name || 'Select a File';
    const accept = constraints['content-types'].toString() || false;
    const maxSize = constraints['content-length'] || Infinity;
    return (
      <Dropzone
        className="form-control input-like-button"
        accept={accept}
        maxSize={maxSize}
        onDropAccepted={e => this.handleChange(e)}
      >
        {value}
      </Dropzone>
    );
  }
}

FileField.propTypes = propTypes;
FileField.defaultProps = defaultProps;

export default FileField;
