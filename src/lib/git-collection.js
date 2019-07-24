'use strict';
const Immutable = require('immutable');
const GitStatus = require('./git-status');
const GitPackage = require('./git-package');
const path = require('path');
const fs = require('fs');
const git = require('simple-git');
const isDir = require('./is-dir');
const DateUtils = require('./date-utils');
require('colors');

const LOG_ARGUMENTS = Immutable.fromJS([
    'log',
    '--graph',
    "--pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset'",
    '--abbrev-commit',
    '--date=relative'
]);

const LOG_ALL_ARGUMENTS = LOG_ARGUMENTS.push('--all');

const isGitDir = config => isDir(path.join(config instanceof Immutable.Map ? config.get('path') : config, '.git'));

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

        this.repos = dirs.filter(isGitDir).map((repoConfig) => {
            if (repoConfig instanceof Immutable.Map) {
                return new GitPackage(repoConfig.get('path'), repoConfig.get('name'), repoConfig.get('group'));
            } else {
                return new GitPackage(repoConfig);
            }
        });
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
     * @param {boolean} onAll operate on all packages, not just the ones with changes
     * @param {boolean} branchName the name of the branch to checkout or create and checkout
     * @param {Array<string>} targetRepoPaths the repos to operate on, defaulting to the ones with changes
     */
    checkout(onAll, branchName, upstream, targetRepoPaths) {
        this._runWithStatus(onAll, targetRepoPaths, (repo, status) => {
            repo.git._run(['branch', "--format=%(refname:short)"], (err, branchSummary) => {
                const branches = new Immutable.Set(branchSummary.split(/[\n\r]/).map(s => s.trim()));
                const branchExists = branches.contains(branchName);
                const args = Immutable.fromJS(['checkout']);
                const toRun = branchExists ? args.push(branchName) : args.push('-b', branchName, upstream)
                repo.git._run((toRun).toJS(), function (err, status) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`checkout ${repo.basename} ${err === null ? 'success'.green : 'error'.red}`);
                    }
                });
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
     * Just like log, except the results will be sorted by date between all of the repos.
     * @param {boolean} showAll
     * @param {number} n
     * @param {boolean} showAllBranches
     * @param {Array<string>} targetRepoPaths
     */
    logCombine(showAll, n, showAllBranches, targetRepoPaths) {
        const numRepos = targetRepoPaths.length;
        const args = [
            'log',
            "--pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset __%at__'",
            '--abbrev-commit',
            `-n ${n || 10}`
        ];

        const results = this._runAgainstRepos(showAll, targetRepoPaths, args, function(err, data, status, repo){
            return data.map(line => `${repo.basename} ${line}`);
        });

        results.then(function(changeLines){
            const combinedLines = changeLines.reduce((acc, lines) => acc.concat(lines), []);
            console.log(combinedLines
                        .sort(DateUtils.compare)
                        .map(DateUtils.stripComparatorTimestamp)
                        .join('\n'));
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
     * @param {Array<string>} targetRepoSpecs
     * @returns {Immutable.List<GitPackage>}
     * @private
     */
    _filterBySpecs(targetRepoSpecs) {
        const baseNames = Immutable.Set(targetRepoSpecs)
           .map(repoSpec => path.basename(repoSpec));

        return this.repos.filter((repo) => {
            return baseNames.includes(repo.basename) || baseNames.includes(repo.group);
        });
    }

    /**
     *
     * @param {boolean} showAll
     * @param {Array<string>} filterRepoSpecs
     * @param {function} handler
     * @private
     */
    _runWithStatus(showAll, filterRepoSpecs, handler) {
        const repos = filterRepoSpecs.length > 0 ? this._filterBySpecs(filterRepoSpecs) : this.repos;

        repos.forEach((repo) => repo.git.status.call(repo.git, function (err, data) {
            const status = new GitStatus(data);
            if (!showAll && !(status.anyChanged() || status.anyUnpushed())) {
                return;
            }

            handler(repo, status);
        }));
    }


    /**
     * @param {boolean} showAll Whether to show all repos or only ones with changes
     * @param {Array<string>} filterRepoSpecs Filtered subset of repos to use
     * @param {function(err, data, status repo) => ?} handler A function that will be passed
     * the raw repo data.
     * @returns {Promise} A Promise that resolves using a .all on each of the repos.
     * You'll have an array of GitPackage objects to work with in a .then.
     * @private
     */
    _runAgainstRepos(showAll, filterRepoSpecs, command, handler){
        const repos = filterRepoSpecs.length > 0 ? this._filterBySpecs(filterRepoSpecs) : this.repos;

        const repoResults = repos.map(function(repo){
            return new Promise((acc,rej) => {
                repo.git.status.call(repo.git, function (err, data) {
                    const status = new GitStatus(data);
                    // If the repo should be considered unchanged and ignored
                    if (!showAll && !(status.anyChanged() || status.anyUnpushed())) {
                        acc(null);
                    } else{
                        repo.git._run(command, (err, data) => {
                            acc(handler(err, data && data.split('\n'), status, repo));
                        });
                    }
                });
            });
        });

        return Promise.all(repoResults);
    }
}

module.exports = GitRepoCollection;
