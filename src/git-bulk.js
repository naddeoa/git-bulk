#!/usr/bin/env node
'use strict';

const process = require('./lib/process');
const argv = require('yargs').argv;

const operations = {
    status: (args) => require('./commands/git-bulk-status')(args.all),
    fetch: require('./commands/git-bulk-fetch')
};

const operation = operations[process.argv[2]];
operation(argv);
