#!/usr/bin/env node
'use strict';
const GitCollection = require('./lib/git-collection');
const ConfigFinder = require('./lib/config-finder');
const program = require('commander');
const HelpStrings = require('./lib/help-strings');

program
  .usage(HelpStrings.usageDoc)
  .option('-a, --all', HelpStrings.allDoc)
  .option('-n, --max-count <n>', HelpStrings.maxCountDoc)
  .option('-A, --all-branches', HelpStrings.allBranchesDoc)
  .option('-c, --combine', HelpStrings.logCombineDoc)
  .description(HelpStrings.logDoc)
  .parse(process.argv);

if(program.combine){
    new GitCollection(ConfigFinder.getConfig()).logCombine(program.all, program.maxCount, program.allBranches, program.args);
}else{
    new GitCollection(ConfigFinder.getConfig()).log(program.all, program.maxCount, program.allBranches, program.args);
}
