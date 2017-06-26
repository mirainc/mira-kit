import React from 'react';
import ReactDOM from 'react-dom';
import App from '../src';
import definition from '../src/definition.json';

console.log(definition);

const root = document.querySelector('#root');
ReactDOM.render(<App />, root);
