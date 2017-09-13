'use strict';
class Config {

    /**
     * Create a git-bulk config.
     * @param repositoryRoot The file path to the the root of the repositories. If
     * this path is '/home/user/worskpace/src', then 'src' should contain many git
     * repositories.
     * @param {Array} repositories Can be specified in place of the repositoryRoot.
     * Each item in this array should be either the absolute path to a git repository
     * or a map with a git repository properties.
     */
    constructor(repositoryRoot, repositories) {
        this.repositoryRoot = repositoryRoot;
        this.repositories = repositories;
    }

    static fromJSONFile(jsonPath) {
        const json = require(jsonPath);
        return new Config(json.repositoryRoot, json.repositories);
    }
}

module.exports = Config;