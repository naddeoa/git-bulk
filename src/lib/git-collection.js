'use strict';
const Immutable = require('immutable');
const GitStatus = require('./git-status');
const path = require('path');
const git = require('simple-git');
require('colors');

const LOG_ARGUMENTS = Immutable.fromJS([
    'log',
    '--graph',
    "--pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset'",
    '--abbrev-commit',
    '--date=relative'
]);

const LOG_ALL_ARGUMENTS = LOG_ARGUMENTS.push('--all');

class GitRepoCollection {

    constructor(packageDirs) {
        this.packageDirs = Immutable.fromJS(packageDirs);
        this.repos = this.packageDirs.map((dir) => ({git: git(dir), dir: dir}));
    }

    status(showAll) {
        this._runWithStatus(showAll, (repo, status) => {
            repo.git._run(['status', '--short'], (err, data) => {
                console.log(status.toString(path.basename(repo.dir)));
                console.log(data);
            });
        });
    }

    fetch() {
        this._act('fetch', (err, repo, data) => {
            console.log(`fetch ${path.basename(repo.dir)} ${err === null ? 'success'.green : 'error'.red}`);
        });
    }

    branch(showAll) {
        this._runWithStatus(showAll, (repo, status) => {
            repo.git._run(['branch', '-v'], (err, data) => {
                console.log(status.toString(path.basename(repo.dir)));
                console.log(data);
            });
        });
    }

    log(showAll, n, showAllBranches) {
        this._runWithStatus(showAll, (repo, status) => {
            const logArgs = (showAllBranches ? LOG_ALL_ARGUMENTS : LOG_ARGUMENTS).push(`-n ${n ? n : 10}`);

            repo.git._run(logArgs.toJS(), (err, data) => {
                console.log(status.toString(path.basename(repo.dir)));
                console.log(data);
                console.log();
            });
        });
    }

    _runWithStatus(showAll, handler) {
        this._act('status', (err, repo, data) => {
            const status = new GitStatus(data);
            if (!showAll && !(status.anyChanged() || status.anyUnpushed())) {
                return;
            }

            handler(repo, status);
        });
    }

    _act(method, callback) {
        this.repos.forEach((repo) => repo.git[method].call(repo.git, function (err, data) {
            callback && callback(err, repo, data);
        }));
    }
}

module.exports = GitRepoCollection;