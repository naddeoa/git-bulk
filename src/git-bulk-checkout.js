#!/usr/bin/env node
'use strict';
const GitCollection = require('./lib/git-collection');
const ConfigFinder = require('./lib/config-finder');
const program = require('commander');
const HelpStrings = require('./lib/help-strings');

program
  .usage(HelpStrings.usageDoc)
  .option('-a, --all', HelpStrings.allDoc)
  .option('-b, --branchName <branchName>', HelpStrings.newBranchDoc)
  .option('-u, --upstream <branchName>', HelpStrings.newBranchDoc)
  .description(HelpStrings.branchNameDoc)
  .parse(process.argv);

if(!program.branchName){
    throw 'branchName (-b) is required';
}

new GitCollection(ConfigFinder.getConfig()).checkout(program.all, program.branchName, program.upstream, program.args);
