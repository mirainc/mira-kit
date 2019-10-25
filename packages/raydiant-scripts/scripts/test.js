process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them.
process.on('unhandledRejection', err => {
  throw err;
});

const path = require('path');
const jest = require('jest');
const createJestConfig = require('./utils/createJestConfig');
const argv = process.argv.slice(2);

// Watch unless on CI, in coverage mode, or explicitly running all tests
if (
  !process.env.CI &&
  argv.indexOf('--coverage') === -1 &&
  argv.indexOf('--watchAll') === -1
) {
  argv.push('--watch');
}

const jestConfig = createJestConfig(relativePath =>
  path.resolve(__dirname, '..', relativePath),
);

// Add jest config to arguments.
argv.push('--config', JSON.stringify(jestConfig));

// Run jest.
jest.run(argv);
