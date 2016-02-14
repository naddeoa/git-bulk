#!/usr/bin/env node
'use strict';

const GitCollection = require('./lib/git-collection');
const PackageFinder = require('./lib/package-finder');
const program = require('commander');
const HelpStrings = require('./lib/help-strings');

program
  .usage(HelpStrings.usageDoc)
  .option('-a, --all', HelpStrings.allDoc)
  .option('-n, --max-count <n>', HelpStrings.maxCountDoc)
  .option('-A, --all-branches', HelpStrings.allBranchesDoc)
  .description(HelpStrings.logDoc)
  .parse(process.argv);

new GitCollection(PackageFinder.getPackages()).log(program.all, program.maxCount, program.allBranches, program.args);
