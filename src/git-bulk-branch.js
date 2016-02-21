#!/usr/bin/env node
'use strict';
const GitCollection = require('./lib/git-collection');
const ConfigFinder = require('./lib/config-finder');
const program = require('commander');
const HelpStrings = require('./lib/help-strings');

program
  .usage(HelpStrings.usageDoc)
  .option('-a, --all', HelpStrings.allDoc)
  .description(HelpStrings.branchDoc)
  .parse(process.argv);

new GitCollection(ConfigFinder.getConfig()).branch(program.all, program.args);
