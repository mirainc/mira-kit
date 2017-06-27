import React from 'react';
import ReactDOM from 'react-dom';
import Simulator from './components/Simulator';

export const simulator = (app, definition) => {
  console.log('is real?');
  const root = document.querySelector('#root');
  ReactDOM.render(<Simulator App={app} definition={definition} />, root);
};
