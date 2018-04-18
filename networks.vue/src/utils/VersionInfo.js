import git from '../../target/git-commit-id';

export const jeratixVersionInfo = `${git['git.branch']} (revision: ${git['git.commit.id']}, time: ${git['git.commit.time']})`;
