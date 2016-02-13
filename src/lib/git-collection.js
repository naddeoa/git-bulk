'use strict';

const Immutable = require('immutable');
const GitStatus = require('./git-status');
const path = require('path');
const git = require('simple-git');
require('colors');

class GitRepoCollection {

    constructor(packageDirs) {
        this.packageDirs = Immutable.fromJS(packageDirs);
        this.repos = this.packageDirs.map((dir) => ({git: git(dir), dir: dir}));
    }

    status() {
        this._act('status', (err, repo, data) => this._changedStatuses(repo, new GitStatus(data)));
    }

    fetch() {
        this._act('fetch', (err, repo, data) => {
            console.log(`fetch ${path.basename(repo.dir)} ${err === null ? 'success'.green : 'error'.red}`);
        });
    }

    _changedStatuses(repo, status) {
        const anyChanges = status.anyChanged() || status.anyUnpushed();
        if (!anyChanges) {
            return;
        }

        repo.git._run(['status', '--short', '-b'], (err, data) => {
            console.log(status.colorName(path.basename(repo.dir)));
            console.log(data);
        });
    }

    _act(method, callback) {
        this.repos.forEach((repo) => repo.git[method].call(repo.git, function (err, data) {
            callback && callback(err, repo, data);
        }));
    }
}

module.exports = GitRepoCollection;