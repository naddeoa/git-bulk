'use strict';
const path = require('path');
const Git = require('./git');

class GitPackage {

    /**
     * Create an instance from a {@link PackageRoot}.
     * This will contain a reference to the path and basename, as well
     * as an object that represents an actual git repository.
     * @param {string} absolutePackagePath The file path to the git repository
     * @param {string} name The git repository name (will be used instead of the repository
     * directory basename when provided)
     * @param {string} group The git repository group
     */
    constructor(absolutePackagePath, name, group) {
        this.git = Git.createRepository(absolutePackagePath);
        this.path = absolutePackagePath;
        this.basename = name || path.basename(absolutePackagePath);
        this.group = group;
    }
}

module.exports = GitPackage;
