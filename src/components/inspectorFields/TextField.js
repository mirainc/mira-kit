import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  presentationProperty: PropTypes.object.isRequired,
  updateAppVar: PropTypes.func.isRequired,
  value: PropTypes.string,
};

const defaultProps = {
  value: '',
};

class TextField extends React.Component {
  handleChange(e) {
    e.preventDefault();
    const name = this.props.presentationProperty.name;
    this.props.updateAppVar(name, e.target.value);
  }

  render() {
    const { presentationProperty } = this.props;
    const { name } = presentationProperty;
    const value = this.props.value;
    return (
      <textarea
        name={name}
        onChange={e => this.handleChange(e)}
        rows="4"
        cols="40"
        placeholder={presentationProperty.placeholder}
        value={value}
      />
    );
  }
}

TextField.propTypes = propTypes;
TextField.defaultProps = defaultProps;

export default TextField;
