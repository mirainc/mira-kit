/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import Simulator from './components/Simulator';

// eslint-disable-next-line
export const simulator = (app, definition) => {
  const root = document.querySelector('#root');
  ReactDOM.render(<Simulator App={app} definition={definition} />, root);
};
