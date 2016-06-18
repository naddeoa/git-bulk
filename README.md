
# Perform operations on git repositories in bulk

In the real world, we often work with multiple git repositories in a single
project. Changes may span across repositories and multitasking can force us to
manage branches across multiple repositories as well. The goal for this project
is to make managing changes and branches across multiple repositories easy.

At the moment, it makes assumptions based on my own workspaces: a project single
root with many repositories in a `src` folder.

## Installation

git-bulk can be installed through npm.

```
npm install -g git-bulk
```

## Operations <sub><sup>`git-bulk help <command>`</sup></sub>
These are the supported operations. It is assumed that `git-bulk` will be
executed from the project root. Most of these commands also support targeting subsets
of the repositories as well, which looks like `git-bulk status ./src/Repo1 ./src/Repo2 Repo3`.
Repository names can be specified as directory names or paths. For more information on these
commands, run `git-bulk help <command>`.

`git-bulk help` -
Show the help menu with a list of all possible operations.

`git-bulk status` -
Execute `git status` on all of the repositories that have any changes, where a
change can be modified files, committed files, or being ahead/behind of the
tracking branch. Names are color coded as well. Repository names will be green
when they have no uncommitted changes and they are ahead of the remote, blue
when there are uncommitted changes, and red when they are behind the remote.

`git-bulk fetch` -
Execute a `git fetch` on each of the git repositories. Each repository name will
be printed, along with whether it was successful or not.

`git-bulk branch` -
Execute a `git branch -v` on each of the gir repositories.

`git-bulk log` -
Execute a `git log` on each of the git repositories. This will use a condensed,
custom graph view to display the log for each repo. Optionally pass `-n <number>`
to change the amount of commits displayed, and `-A` to show all branches at once.

`git-bulk reset` -
Execute a `git reset` on each git repository. You can pass a `-h` or `--hard` switch
as well.

`git-bulk checkout` -
Execute a `git checkout` on each git repository. Passing `-b branchName` is
mandatory. Passing a `-u branchName` option will also set a tracking branch when
creating branches. This will checkout the branch on the target packages, or
create it if it does not exist.

`git-bulk rebase` -
Execute a `git rebase` on each git repository. The rebase will only affect
repos with changes, unless the `-a` flag is given. If the `-i` flag is given,
then rebase will be run in interactive mode. Repo names/paths can also be specified to run
rebase on a subset of repos. The -a flag is still required, even when
specifying repo names manually that have no changes.

