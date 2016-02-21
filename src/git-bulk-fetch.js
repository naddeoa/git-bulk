#!/usr/bin/env node
'use strict';
const GitCollection = require('./lib/git-collection');
const ConfigFinder = require('./lib/config-finder');
const program = require('commander');
const HelpStrings = require('./lib/help-strings');

program
  .description(HelpStrings.fetchDoc)
  .parse(process.argv);

new GitCollection(ConfigFinder.getConfig()).fetch();
