const { matchedData } = require('express-validator');
const debug = require('debug')('dependencies');

async function getJobDependencies(req, res, next) {
  debug('getJobDependencies');
  const params = matchedData(req);

  const { id } = params;
  await req.client.query('SELECT * FROM view_job_dependencies WHERE dep_down=$1', [id])
    .then((results) => { req.result = results.rows; })
    .catch((error) => {
      req.error = {
        msg: error.toString(),
        code: 500,
        function: 'getJobDependencies',
      };
    });
  next();
}

async function getProjectDependencies(req, res, next) {
  debug('getProjectDependencies');
  const params = matchedData(req);

  const { id } = params;
  await req.client.query('SELECT * FROM view_project_dependencies WHERE dep_down=$1', [id])
    .then((results) => { req.result = results.rows; })
    .catch((error) => {
      req.error = {
        msg: error.toString(),
        code: 500,
        function: 'getProjectDependencies',
      };
    });
  next();
}

module.exports = {
  getJobDependencies,
  getProjectDependencies,
};
