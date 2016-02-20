#!/usr/bin/env node
'use strict';

const GitCollection = require('./lib/git-collection');
const PackageFinder = require('./lib/package-finder');
const program = require('commander');
const HelpStrings = require('./lib/help-strings');
const process = require('./lib/process');

program
  .usage('[options] [repositories...]')
  .description(HelpStrings.rebaseDoc)
  .option('-a, --all', 'Rebase all repositories, not just the ones with changes.')
  .option('-i, --interactive', 'Run rebase in interractive mode')
  .on('--help', HelpStrings.examples(['git-bulk-rebase -a Repo1 ./src/Repo2', 'git-bulk-rebase -i']))
  .parse(process.argv);

new GitCollection(PackageFinder.getPackages()).rebase(program.all, program.interactive, program.args);
