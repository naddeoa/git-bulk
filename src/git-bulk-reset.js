#!/usr/bin/env node
'use strict';
const GitCollection = require('./lib/git-collection');
const ConfigFinder = require('./lib/config-finder');
const program = require('commander');
const HelpStrings = require('./lib/help-strings');
const process = require('./lib/process');

program
  .usage('[options] [repositories...]')
  .description(HelpStrings.resetDoc)
  .option('-a, --all', 'Reset all repositories, not just the ones with changes.')
  .option('-h, --hard', 'Exeute a reset in hard mode in git. This may delete files.')
  .parse(process.argv);

new GitCollection(ConfigFinder.getConfig()).reset(program.all, program.hard, program.args);
