function getMissingParameterMsg(param) {
  return `Le paramètre '${param}' est requis.`;
}

function getInvalidParameterMsg(param) {
  return `Le paramètre '${param}' est invalide.`;
}

function getInvalidProjectSchema() {
  return 'La structure du project est invalide.';
}

function getInvalidIdsSchema() {
  return 'La structure de la liste des ids est invalide.';
}

function getInvalidHostsSchema() {
  return 'La structure de la liste des hostnames est invalide.';
}

function getInvalidProjectDependencies() {
  return 'La cohérence des dépendences entre projets est invalide.';
}

function getInvalidJobsDependencies() {
  return 'La cohérence des dépendences entre jobs est invalide.';
}

module.exports = {
  getMissingParameterMsg,
  getInvalidParameterMsg,
  getInvalidProjectSchema,
  getInvalidIdsSchema,
  getInvalidHostsSchema,
  getInvalidProjectDependencies,
  getInvalidJobsDependencies,
};
