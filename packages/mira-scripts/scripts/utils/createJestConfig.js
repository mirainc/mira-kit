const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const paths = require('../../config/paths');
const appPackageJson = require(paths.appPackageJson);

module.exports = resolve => {
  const rootDir = paths.appPath;
  // Use relative url if setup file exists.
  const setupTestsFile = fs.existsSync(paths.testsSetup)
    ? '<rootDir>/src/setupTests.js'
    : undefined;

  // Convert an absolute path to one that is relative to <rootDir>.
  const toRelRootDir = f => '<rootDir>/' + path.relative(rootDir || '', f);

  const config = {
    rootDir,
    collectCoverageFrom: ['src/**/*.{js,jsx,mjs}'],
    setupFiles: [resolve('config/polyfills.js')],
    setupTestFrameworkScriptFile: setupTestsFile,
    testMatch: [
      '**/__tests__/**/*.{js,jsx,mjs}',
      '**/?(*.)(spec|test).{js,jsx,mjs}',
    ],
    // Where to search for test files.
    roots: [paths.appSrc].map(toRelRootDir),
    testEnvironment: 'node',
    testURL: 'http://localhost',
    transform: {
      '^.+\\.(js|jsx|mjs)$': resolve('config/jest/babelTransform.js'),
      '^.+\\.css$': resolve('config/jest/cssTransform.js'),
      // Default to using the file transform for non js and css files.
      '^(?!.*\\.(js|jsx|mjs|css|json)$)': resolve(
        'config/jest/fileTransform.js',
      ),
    },
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$'],
    moduleFileExtensions: [
      'web.js',
      'mjs',
      'js',
      'json',
      'web.jsx',
      'jsx',
      'node',
    ],
  };

  // Allow overrides from the app's package.json.
  const overrides = { ...appPackageJson.jest };
  const supportedKeys = [
    'collectCoverageFrom',
    'coverageReporters',
    'coverageThreshold',
    'resetMocks',
    'resetModules',
    'snapshotSerializers',
    'watchPathIgnorePatterns',
  ];

  // Add any supported overrides to the jest config
  supportedKeys.forEach(key => {
    if (overrides.hasOwnProperty(key)) {
      config[key] = overrides[key];
      delete overrides[key];
    }
  });

  // The keys that are left in override are unsupported.
  const unsupportedKeys = Object.keys(overrides);
  if (unsupportedKeys.length > 0) {
    const isOverridingSetupFile =
      unsupportedKeys.indexOf('setupTestFrameworkScriptFile') > -1;

    if (isOverridingSetupFile) {
      console.error(
        chalk.red(
          'We detected ' +
            chalk.bold('setupTestFrameworkScriptFile') +
            ' in your package.json.\n\n' +
            'Remove it from Jest configuration, and put the initialization code in ' +
            chalk.bold('src/setupTests.js') +
            '.\nThis file will be loaded automatically.\n',
        ),
      );
    } else {
      console.error(
        chalk.red(
          '\nOut of the box, MiraKit only supports overriding ' +
            'these Jest options:\n\n' +
            supportedKeys.map(key => chalk.bold('  \u2022 ' + key)).join('\n') +
            '.\n\n' +
            'These options in your package.json Jest configuration ' +
            'are not currently supported by MiraKit:\n\n' +
            unsupportedKeys
              .map(key => chalk.bold('  \u2022 ' + key))
              .join('\n'),
        ),
      );
    }

    // Terminate with error.
    process.exit(1);
  }

  return config;
};
