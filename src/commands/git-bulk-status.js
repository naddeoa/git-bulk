#!/usr/bin/env node
'use strict';

const GitCollection = require('../lib/git-collection');
const PackageFinder = require('../lib/package-finder');

module.exports = (changedOnly) => new GitCollection(PackageFinder.getPackages()).status(changedOnly);

