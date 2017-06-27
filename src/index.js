import React from 'react';
import ReactDOM from 'react-dom';
import Simulator from './components/Simulator';

const main = (App, definition) => {
  const root = document.querySelector('#root');
  ReactDOM.render(<Simulator App={app} definition={definition} />, root);
};

module.exports = main;
