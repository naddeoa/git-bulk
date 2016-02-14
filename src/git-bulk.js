#!/usr/bin/env node
'use strict';
const process = require('./lib/process');
const program = require('commander');
const HelpStrings = require('./lib/help-strings');

program.version(HelpStrings.version)
  .description('Perform operations on git repositories in bulk')
  .command('status', HelpStrings.statusDoc)
  .command('fetch', HelpStrings.fetchDoc)
  .command('branch', HelpStrings.branchDoc)
  .command('log', HelpStrings.logDoc)
  .command('reset', HelpStrings.resetDoc);

program.parse(process.argv);