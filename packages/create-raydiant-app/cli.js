const commander = require('commander');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const validateProjectName = require('validate-npm-package-name');
const packageJson = require('./package.json');
const createRaydiantApp = require('./createRaydiantApp');

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Project can be a relative path from the current working directory.
let projectName;

const program = new commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .action(name => {
    // Action will not be called if there are no arguments.
    projectName = name;
  })
  .option('--use-npm')
  .option('--verbose', 'print additional logs')
  .option(
    '--scripts-version <alternative-package>',
    'use an older or non-standard version of raydiant-scripts',
  )
  .option(
    '--kit-version <alternative-package>',
    'use an older or non-standard version of raydiant-kit',
  )
  .allowUnknownOption()
  .on('--help', () => {
    console.log();
    console.log(`    If you have any problems, please open an an issue:`);
    console.log(
      `    ${chalk.cyan('https://github.com/mirainc/mira-kit/issues/new')}`,
    );
    console.log();
  })
  .parse(process.argv);

// Ensure project name is provided.
checkProjectName(projectName);
const rootAppPath = path.resolve(projectName);
const appName = path.basename(rootAppPath);
// Ensure app name is a valid npm package name.
checkAppName(appName);

// All is good, try creating a raydiant app.
createRaydiantApp(
  projectName,
  rootAppPath,
  appName,
  program.scriptsVersion,
  program.kitVersion,
  program.verbose,
  program.useNpm,
).then(null, handleCLIError);

function checkProjectName(projectName) {
  if (typeof projectName === 'undefined') {
    console.error('Please specify the project directory:');
    console.log(
      `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`,
    );
    console.log();
    console.log('For example:');
    console.log(
      `  ${chalk.cyan(program.name())} ${chalk.green('my-raydiant-app')}`,
    );
    process.exit(1);
  }
}

function checkAppName(appName) {
  const validationResult = validateProjectName(appName);
  if (!validationResult.validForNewPackages) {
    console.error(
      `Could not create a project called ${chalk.red(
        `"${appName}"`,
      )} because of npm naming restrictions:`,
    );
    printValidationResults(validationResult.errors);
    printValidationResults(validationResult.warnings);
    process.exit(1);
  }
}

function printValidationResults(results) {
  if (typeof results !== 'undefined') {
    results.forEach(error => {
      console.error(chalk.red(`  *  ${error}`));
    });
  }
}

function handleCLIError(reason) {
  console.log('Aborting installation.');
  if (reason.command) {
    console.log(`  ${chalk.cyan(reason.command)} has failed.`);
  } else {
    console.log(chalk.red('Unexpected error. Please report it as a bug:'));
    console.log(reason);
  }
  // On 'exit' we will delete these files from target directory.
  const knownGeneratedFiles = ['package.json', 'node_modules'];
  const currentFiles = fs.readdirSync(path.join(rootAppPath));
  currentFiles.forEach(file => {
    knownGeneratedFiles.forEach(fileToMatch => {
      // This remove all of knownGeneratedFiles.
      if (file === fileToMatch) {
        console.log(`Deleting generated file... ${chalk.cyan(file)}`);
        fs.removeSync(path.join(rootAppPath, file));
      }
    });
  });
  const remainingFiles = fs.readdirSync(path.join(rootAppPath));
  if (!remainingFiles.length) {
    // Delete target folder if empty.
    console.log(
      `Deleting ${chalk.cyan(`${appName}/`)} from ${chalk.cyan(
        path.resolve(rootAppPath, '..'),
      )}`,
    );
    process.chdir(path.resolve(rootAppPath, '..'));
    fs.removeSync(path.join(rootAppPath));
  }
  console.log('Done.');
  process.exit(1);
}
