const packageJson = require('../../package.json');

module.exports = {
    /**
     *
     * @param {Array<string>} commandExamples
     * @return {function}
     */
    examples: (commandExamples) => () => {
        console.log('  Examples:');
        console.log();
        commandExamples.forEach((example) => console.log(`    $ ${example}`));
        console.log();
    },
    version: packageJson.version,
    fetchDoc: 'Execute fetch on each repository, outputting the success/failure as it goes.',
    statusDoc: 'Execute git status on each repository, displaying output for those with changes.',
    branchDoc: 'Execute git branch on each repository.',
    logDoc: 'Execute git log on each repository.',
    logCombineDoc: 'Like log, but combine output from all repositories, sorted by date.',
    maxCountDoc: 'Limit the number of commits displayed.',
    allBranchesDoc: 'Show all branches in git log, not just the current branch.',
    resetDoc: 'Execute git reset on each repository.',
    repositoriesDoc: 'An optional subset of repositories to run against, where the name is a directory name, or a relative path to one.',
    allDoc: 'Show output for all repositories, not only ones with changes.',
    rebaseDoc: 'Execute git rebase on each repository.',
    usageDoc: '[options] [repositories...]',
    checkoutDoc: 'Execute git checkout on each repository',
    branchNameDoc: 'The name of the branch. It will be created if it does not exist'
};
