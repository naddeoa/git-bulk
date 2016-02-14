#!/usr/bin/env node
'use strict';

const GitCollection = require('./lib/git-collection');
const PackageFinder = require('./lib/package-finder');
const program = require('commander');
const HelpStrings = require('./lib/help-strings');

program
  .option('--all', 'Show output for all repositories, not only ones with changes')
  .description(HelpStrings.statusDoc)
  .parse(process.argv);

new GitCollection(PackageFinder.getPackages()).status(program.all);
