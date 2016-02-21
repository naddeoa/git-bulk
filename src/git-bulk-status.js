#!/usr/bin/env node
'use strict';
const GitCollection = require('./lib/git-collection');
const ConfigFinder = require('./lib/config-finder');
const program = require('commander');
const HelpStrings = require('./lib/help-strings');
const process = require('./lib/process');

program
  .usage(HelpStrings.usageDoc)
  .description(HelpStrings.statusDoc)
  .option('-a, --all', HelpStrings.allDoc)
  .parse(process.argv);

new GitCollection(ConfigFinder.getConfig()).status(program.all, program.args);
