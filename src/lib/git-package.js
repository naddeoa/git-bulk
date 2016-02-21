'use strict';
const path = require('path');
const Git = require('./git');

class GitPackage {

    /**
     * Create an instance from a {@link PackageRoot}.
     * This will contain a reference to the path and basename, as well
     * as an object that represents an actual git repository.
     * @param {string} absolutePackagePath The file path to the git repository
     */
    constructor(absolutePackagePath) {
        this.git = Git.createRepository(absolutePackagePath);
        this.path = absolutePackagePath;
        this.basename = path.basename(absolutePackagePath);
    }
}

module.exports = GitPackage;
