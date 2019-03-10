import React from 'react';
import ReactDOM from 'react-dom';
import Simulator from './Simulator';

// expose simulator instance on window
const exposeSimulator = simulator => {
  window.simulator = simulator;
};

ReactDOM.render(
  <Simulator ref={exposeSimulator} />,
  document.getElementById('react-root'),
);
