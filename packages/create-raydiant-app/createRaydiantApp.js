const chalk = require('chalk');
const execSync = require('child_process').execSync;
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const semver = require('semver');
const isSafeToCreateProjectIn = require('./isSafeToCreateProjectIn');
const install = require('./install');

module.exports = async (
  projectName,
  appPath,
  appName,
  scriptsVersion,
  kitVersion,
  verbose,
  useNpm,
) => {
  fs.ensureDirSync(appPath);

  if (!isSafeToCreateProjectIn(appPath, projectName)) {
    process.exit(1);
  }

  console.log(`Creating a new Raydiant app in ${chalk.green(appPath)}.`);
  console.log();

  const packageJson = {
    name: appName,
    version: '0.1.0',
    private: true,
  };

  // Create the app's package json.
  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL,
  );

  const useYarn = useNpm ? false : isYarnAvailable();
  const originalDirectory = process.cwd();
  // Change working direction to app root.
  process.chdir(appPath);

  const scriptsPackage = getInstallPackage(
    'raydiant-scripts',
    scriptsVersion,
    originalDirectory,
  );
  const scriptsPackageName = getPackageName(scriptsPackage);
  const kitPackage = getInstallPackage(
    'raydiant-kit',
    kitVersion,
    originalDirectory,
  );
  const kitPackageName = getPackageName(kitPackage);
  console.log(`Installing ${scriptsPackageName} and ${kitPackageName}...`);
  console.log();

  await install(appPath, useYarn, [scriptsPackage, kitPackage], verbose);

  const scriptsPath = path.resolve(
    process.cwd(),
    'node_modules',
    scriptsPackageName,
    'scripts',
    'init.js',
  );

  const init = require(scriptsPath);
  init(appPath, appName, verbose, originalDirectory);
};

function isYarnAvailable() {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function getInstallPackage(packageToInstall, version, originalDirectory) {
  const validSemver = semver.valid(version);
  if (validSemver) {
    packageToInstall += `@${validSemver}`;
  } else if (version && version.match(/^file:/)) {
    packageToInstall = `file:${path.resolve(
      originalDirectory,
      version.match(/^file:(.*)?$/)[1],
    )}`;
  } else if (version) {
    // for tar.gz or alternative paths
    packageToInstall = version;
  }
  return packageToInstall;
}

// Extract package name from tarball url or path.
// tarball support removed for simplicity.
function getPackageName(installPackage) {
  if (installPackage.indexOf('git+') === 0) {
    // Pull package name out of git urls e.g:
    // git+https://github.com/mycompany/react-scripts.git
    // git+ssh://github.com/mycompany/react-scripts.git#v1.2.3
    return installPackage.match(/([^/]+)\.git(#.*)?$/)[1];
  } else if (installPackage.match(/.+@/)) {
    // Do not match @scope/ when stripping off @version or @tag
    return installPackage.charAt(0) + installPackage.substr(1).split('@')[0];
  } else if (installPackage.match(/^file:/)) {
    const installPackagePath = installPackage.match(/^file:(.*)?$/)[1];
    const installPackageJson = require(path.join(
      installPackagePath,
      'package.json',
    ));
    return installPackageJson.name;
  }
  return installPackage;
}
