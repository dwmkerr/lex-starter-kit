function getRepoOwnerAndName(repository) {
  const repoParts = repository.split('/');
  return {
    owner: repoParts[0],
    name: repoParts[1]
  };
}

module.exports = getRepoOwnerAndName;
