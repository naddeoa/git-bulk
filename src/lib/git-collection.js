'use strict';
const Immutable = require('immutable');
const GitStatus = require('./git-status');
const GitPackage = require('./git-package');
const path = require('path');
const fs = require('fs');
const git = require('simple-git');
require('colors');

const LOG_ARGUMENTS = Immutable.fromJS([
    'log',
    '--graph',
    "--pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset'",
    '--abbrev-commit',
    '--date=relative'
]);

const isGitDir = function (dir) {
    try {
        fs.lstatSync(path.join(dir, '.git')).isDirectory();
        return true;
    } catch (e) {
        return false;
    }
}

const LOG_ALL_ARGUMENTS = LOG_ARGUMENTS.push('--all');

class GitRepoCollection {

    /**
     *
     * @param {Immutable.List<PackageRoot>} packageList
     * @property {Immutable.List<GitPackage>} repos
     */
    constructor(config) {
        let dirs;
        if (config.repositoryRoot) {
            dirs = Immutable.fromJS(fs.readdirSync(config.repositoryRoot))
              .map(dir => path.join(config.repositoryRoot, dir));
        } else if (config.repositories) {
            dirs = Immutable.fromJS(config.repositories);
        } else {
            throw 'Config needs to have either a repositoryRoot or repositories array';
        }

        this.repos = dirs.filter(isGitDir)
          .map((packageRoot) => new GitPackage(packageRoot));
    }

    /**
     *
     * @param {boolean} showAll
     * @param {Array<string>} targetRepoPaths
     */
    status(showAll, targetRepoPaths) {
        this._runWithStatus(showAll, targetRepoPaths, (repo, status) => {
            repo.git._run(['status', '--short'], (err, data) => {
                console.log(status.toString(repo.basename));
                console.log(data);
            });
        });
    }

    fetch() {
        this._runWithStatus(true, [], (repo, status) => {
            repo.git.fetch(err => console.log(`fetch ${repo.basename} ${err === null ? 'success'.green : 'error'.red}`));
        });
    }

    /**
     *
     * @param {boolean} showAll
     * @param {Array<string>} targetRepoPaths
     */
    branch(showAll, targetRepoPaths) {
        this._runWithStatus(showAll, targetRepoPaths, (repo, status) => {
            repo.git._run(['branch', '-v'], (err, data) => {
                console.log(status.toString(repo.basename));
                console.log(data);
            });
        });
    }

    /**
     *
     * @param {boolean} showAll
     * @param {number} n
     * @param {boolean} showAllBranches
     * @param {Array<string>} targetRepoPaths
     */
    log(showAll, n, showAllBranches, targetRepoPaths) {
        this._runWithStatus(showAll, targetRepoPaths, (repo, status) => {
            const logArgs = (showAllBranches ? LOG_ALL_ARGUMENTS : LOG_ARGUMENTS).push(`-n ${n ? n : 10}`);

            repo.git._run(logArgs.toJS(), (err, data) => {
                console.log(status.toString(repo.basename));
                console.log(data);
                console.log();
            });
        });
    }

    /**
     *
     * @param {boolean} resetAll
     * @param {boolean} hard
     * @param {Array<string>} targetRepoPaths
     */
    reset(resetAll, hard, targetRepoPaths) {
        this._runWithStatus(resetAll, targetRepoPaths, (repo, status) => {
            const mode = hard ? 'hard' : 'soft';

            repo.git.reset(mode, (err) => {
                console.log(status.toString(repo.basename));
                repo.git._run(['status', '--short'], (err) => err && console.log(err));
            });
        });
    }

    /**
     *
     * @param {boolean} all
     * @param {boolean} interactive
     * @param {Array<string>} targetRepoPaths
     */
    rebase(all, interactive, targetRepoPaths) {
        const rebaseArgs = interactive ? ['rebase', '-i'] : ['rebase'];

        this._runWithStatus(all, targetRepoPaths, (repo, status) => {
            repo.git._run(rebaseArgs, (err) => {
                console.log(`rebase ${repo.basename} ${err === null ? 'success'.green : 'error'.red}`);
            });
        });
    }

    /**
     *
     * @param {Array<string>} targetRepoPaths
     * @returns {Immutable.List<GitPackage>}
     * @private
     */
    _filterByPaths(targetRepoPaths) {
        const baseNames = Immutable.Set(targetRepoPaths)
          .map(repoPath => path.basename(repoPath));

        return this.repos.filter((repo) => baseNames.includes(repo.basename));
    }

    /**
     *
     * @param {boolean} showAll
     * @param {Array<string>} filterRepoNames
     * @param {function} handler
     * @private
     */
    _runWithStatus(showAll, filterRepoNames, handler) {
        const repos = filterRepoNames.length > 0 ? this._filterByPaths(filterRepoNames) : this.repos;

        repos.forEach((repo) => repo.git.status.call(repo.git, function (err, data) {
            const status = new GitStatus(data);
            if (!showAll && !(status.anyChanged() || status.anyUnpushed())) {
                return;
            }

            handler(repo, status);
        }));
    }
}

module.exports = GitRepoCollection;