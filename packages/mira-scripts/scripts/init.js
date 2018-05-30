const chalk = require('chalk');
const execSync = require('child_process').execSync;
const spawn = require('cross-spawn');
const fs = require('fs-extra');
const os = require('os');
const path = require('path');

// Makes the script crash on unhandled rejections instead of silently
// ignoring them.
process.on('unhandledRejection', err => {
  throw err;
});

module.exports = (appPath, appName, verbose, originalDirectory) => {
  const ownPackageName = require(path.join(__dirname, '..', 'package.json'))
    .name;
  const ownPath = path.join(appPath, 'node_modules', ownPackageName);
  const appPackage = require(path.join(appPath, 'package.json'));
  const useYarn = fs.existsSync(path.join(appPath, 'yarn.lock'));

  appPackage.scripts = {
    start: 'mira-scripts start',
    build: 'mira-scripts build',
    deploy: 'mira-scripts deploy --token=$API_TOKEN --app=$APP_ID',
    static: 'mira-scripts static',
    test: 'mira-scripts test --env=jsdom',
  };

  // Write updated package.json.
  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(appPackage, null, 2) + os.EOL,
  );

  // Move existing README before copying one from the template.
  const readmeExists = fs.existsSync(path.join(appPath, 'README.md'));
  if (readmeExists) {
    fs.renameSync(
      path.join(appPath, 'README.md'),
      path.join(appPath, 'README.old.md'),
    );
  }

  const templatePath = path.join(ownPath, 'template');
  if (fs.existsSync(templatePath)) {
    fs.copySync(templatePath, appPath);
  } else {
    console.error(
      `Could not locate supplied template: ${chalk.green(templatePath)}`,
    );
    return;
  }

  // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
  // See: https://github.com/npm/npm/issues/1862
  try {
    fs.moveSync(
      path.join(appPath, 'gitignore'),
      path.join(appPath, '.gitignore'),
      [],
    );
  } catch (err) {
    // Append if there's already a `.gitignore` file there
    if (err.code === 'EEXIST') {
      const data = fs.readFileSync(path.join(appPath, 'gitignore'));
      fs.appendFileSync(path.join(appPath, '.gitignore'), data);
      fs.unlinkSync(path.join(appPath, 'gitignore'));
    } else {
      throw err;
    }
  }

  const dependencies = ['react@^16.4.0', 'react-dom@^16.4.0', 'prop-types'];
  const devDependencies = ['react-test-renderer@^16.4.0'];
  installDeps(dependencies, useYarn, verbose);
  installDeps(devDependencies, useYarn, verbose, true);

  if (tryGitInit(appPath)) {
    console.log();
    console.log('Initialized a git repository.');
  }

  // Display the most elegant way to cd.
  let cdpath;
  if (path.join(originalDirectory, appName) === appPath) {
    cdpath = appName;
  } else {
    cdpath = appPath;
  }

  // Change displayed command to yarn instead of yarnpkg
  const displayedCommand = useYarn ? 'yarn' : 'npm';
  console.log();
  console.log(`Success! Created ${appName} at ${appPath}`);
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} start`));
  console.log('    Runs your app in the simulator for local development.');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} build`));
  console.log(
    '    Bundles a production build of your app to /build. Run this before deploying.',
  );
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} deploy`));
  console.log('    Deploys a new version of your app from /build.');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} static`));
  console.log(
    '    Output the app and simulator as a static site to /static. Useful for sharing a test page before deploying.',
  );
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} test`));
  console.log('    Runs the jest test suite against files ending in .test.js.');
  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(chalk.cyan('  cd'), cdpath);
  console.log(`  ${chalk.cyan(`${displayedCommand} start`)}`);
  if (readmeExists) {
    console.log();
    console.log(
      chalk.yellow(
        'You had a `README.md` file, we renamed it to `README.old.md`',
      ),
    );
  }
};

function installDeps(depedencies, useYarn, verbose, isDev) {
  let command;
  let args;

  if (useYarn) {
    command = 'yarn';
    args = ['add'];
    if (isDev) args.push('--dev');
  } else {
    command = 'npm';
    args = ['install', isDev ? '--save-dev' : '--save'];
  }

  if (verbose) {
    args.push('--verbose');
  }

  args = [...args, ...depedencies];

  console.log(`Installing dependencies using ${command}...`);
  console.log();

  const proc = spawn.sync(command, args, { stdio: 'inherit' });
  if (proc.status !== 0) {
    console.error(`\`${command} ${args.join(' ')}\` failed`);
    return;
  }
}

function tryGitInit(appPath) {
  try {
    execSync('git --version', { stdio: 'ignore' });
    if (isInGitRepository() || isInMercurialRepository()) {
      return false;
    }

    execSync('git init', { stdio: 'ignore' });

    return true;
  } catch (e) {
    return false;
  }
}

function isInGitRepository() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function isInMercurialRepository() {
  try {
    execSync('hg --cwd . root', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}
