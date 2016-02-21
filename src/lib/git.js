'use strict';
const git = require('simple-git');

class Git {

    /**
     * Wrapper around the simple-git library that makes
     * mocking easier.
     * @param {string} absolutePackagePath file path to the git package.
     * @returns {git} Object from the simple-git library
     */
    static createRepository(absolutePackagePath){
        return git(absolutePackagePath);
    }
}

module.exports = Git;