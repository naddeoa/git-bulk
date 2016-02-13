#!/usr/bin/env node
'use strict';

const process = require('./lib/process');

const operations = {
    status: require('./commands/git-bulk-status'),
    fetch: require('./commands/git-bulk-fetch')
};

const operation = operations[process.argv[2]];
operation();
