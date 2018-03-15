#!/usr/bin/env node

const program = require('commander');
const packageJson = require('../package.json');

// Makes the script crash on unhandled rejections instead of silently
// ignoring them.
process.on('unhandledRejection', err => {
  throw err;
});

program.version(packageJson.version);

program
  .command('init [dir]')
  .description('scaffold a new Mira app')
  .action(async (dir = '.') => {
    const init = require('../scripts/init');
    await init(dir);
  });

program.parse(process.argv);
