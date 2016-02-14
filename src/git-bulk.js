#!/usr/bin/env node
'use strict';
const process = require('./lib/process');
const program = require('commander');
const HelpStrings = require('./lib/help-strings');

program.version(HelpStrings.version)
  .command('status', HelpStrings.statusDoc)
  .command('fetch', HelpStrings.fetchDoc)
  .command('branch', HelpStrings.branchDoc)
  .command('log', HelpStrings.logDoc);

program.parse(process.argv);