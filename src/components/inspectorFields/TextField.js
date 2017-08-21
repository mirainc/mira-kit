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
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    const { presentationProperty, updateAppVar } = this.props;
    const { name } = presentationProperty;
    updateAppVar(name, e.target.value);
  }

  render() {
    const { presentationProperty, value } = this.props;
    const { name, placeholder } = presentationProperty;
    return (
      <textarea
        name={name}
        onChange={this.handleChange}
        rows="4"
        cols="40"
        placeholder={placeholder}
        value={value}
      />
    );
  }
}

TextField.propTypes = propTypes;
TextField.defaultProps = defaultProps;

export default TextField;
