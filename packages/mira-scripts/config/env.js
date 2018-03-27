const fs = require('fs');
const paths = require('./paths');

// Make sure that including paths.js after env.js will read .env variables.
delete require.cache[require.resolve('./paths')];

const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) {
  throw new Error(
    'The NODE_ENV environment variable is required but was not specified.',
  );
}

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  `${paths.dotenv}.${NODE_ENV}.local`,
  `${paths.dotenv}.${NODE_ENV}`,
];

// Don't include `.env.local` for `test` environment
if (NODE_ENV !== 'test') {
  dotenvFiles.push(`${paths.dotenv}.local`);
}

// The main .env file
dotenvFiles.push(paths.dotenv);

// Load .env files for the current environment, if they exist.
dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv-expand')(
      require('dotenv').config({
        path: dotenvFile,
      }),
    );
  }
});

// Grab NODE_ENV and MIRA_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.
module.exports = (additionalEnvVars = {}) => {
  const clientEnvVars = Object.keys(process.env)
    .filter(key => /^MIRA_APP_/i.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        NODE_ENV: process.env.NODE_ENV || 'development',
        ...additionalEnvVars,
      },
    );

  const stringified = {
    'process.env': Object.keys(clientEnvVars).reduce((env, key) => {
      env[key] = JSON.stringify(clientEnvVars[key]);
      return env;
    }, {}),
  };

  return { raw: clientEnvVars, stringified };
};
