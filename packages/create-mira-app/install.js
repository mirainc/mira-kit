// Modified from https://github.com/facebook/create-react-app/blob/next/packages/create-react-app/createReactApp.js
const spawn = require('cross-spawn');

module.exports = (root, useYarn, dependencies, verbose) => {
  return new Promise((resolve, reject) => {
    let command;
    let args;

    if (useYarn) {
      command = 'yarn';
      args = ['add'];
      [].push.apply(args, dependencies);
    } else {
      command = 'npm';
      args = ['install', '--save', '--loglevel', 'error'].concat(dependencies);
    }

    if (verbose) {
      args.push('--verbose');
    }

    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('close', code => {
      if (code !== 0) {
        reject({ command: `${command} ${args.join(' ')}` });
        return;
      }
      resolve();
    });
  });
};
