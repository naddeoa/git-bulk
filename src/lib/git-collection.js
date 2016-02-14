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

    status(showAll) {
        const statusFunction = showAll ? this._status : this._changedStatuses;
        this._act('status', (err, repo, data) => statusFunction.call(this, repo, new GitStatus(data)));
    }

    fetch() {
        this._act('fetch', (err, repo, data) => {
            console.log(`fetch ${path.basename(repo.dir)} ${err === null ? 'success'.green : 'error'.red}`);
        });
    }

    branch(showAll) {
        this._act('status', (err, repo, data) => {
            const status = new GitStatus(data);
            if (!showAll && !(status.anyChanged() || status.anyUnpushed())) {
                return;
            }
            repo.git._run(['branch', '-v'], (err, data) => {
                console.log(status.colorName(path.basename(repo.dir)));
                console.log(data);
            });
        });

    }

    _status(repo, status){
        repo.git._run(['status', '--short', '-b'], (err, data) => {
            console.log(status.colorName(path.basename(repo.dir)));
            console.log(data);
        });
    }

    _changedStatuses(repo, status) {
        const anyChanges = status.anyChanged() || status.anyUnpushed();
        if (!anyChanges) {
            return;
        }

        this._status(repo, status);
    }

    _act(method, callback) {
        this.repos.forEach((repo) => repo.git[method].call(repo.git, function (err, data) {
            callback && callback(err, repo, data);
        }));
    }
}

module.exports = GitRepoCollection;