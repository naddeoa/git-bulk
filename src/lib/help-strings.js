const packageJson = require('../../package.json');

module.exports = {
    version: packageJson.version,
    fetchDoc: 'Execute fetch on each repository, outputting the success/failure as it goes.',
    statusDoc: 'Execute git status on each repository, displaying output for those with changes.',
    branchDoc: 'Execute git branch on each repository',
    logDoc: 'Execute git log on each repository.',
    maxCountDoc: 'Limit the number of commits displayed',
    allBranchesDoc: 'Show all branches in git log, not just the current branch.',
    allDoc: 'Show output for all repositories, not only ones with changes'
};