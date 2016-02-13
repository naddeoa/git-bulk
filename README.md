
# Perform operations on git repositories in bulk

In the real world, we often work with multiple git repositories in a single
project. Changes may span across repositories and multitasking can force us to
manage branches across multiple repositories as well. The goal for this project
is to make managing changes and branches across multiple repositories easy.

At the moment, it makes assumptions based on my own workspaces: a project single
root with many repositories in a `src` folder.

# Options
These are the supported operations. It is assumed that `git-bulk` will be
executed from the project root.

## git-bulk status
Execute `git status` on all of the repositories that have any changes, where a
change can be modified files, committed files, or being ahead/behind of the
tracking branch. Names are color coded as well. Repository names will be green
when they have no uncommitted changes and they are ahead of the remote, blue
when there are uncommitted changes, and red when they are behind the remote.

## git-bulk fetch
Execute a `git fetch` on each of the git repositories. Each repository name will
be printed, along with whether it was successful or not.

# Future operations

* `checkout` - For creating and changing branches in bulk, and in a subset
  repositories.
* `branch` - For listing and deleting branches.
