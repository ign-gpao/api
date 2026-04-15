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
  const query = `
    SELECT
      d.id AS dep_id,
      d.upstream AS dep_up,
      d.downstream AS dep_down,
      d.active AS dep_active,
      p.id AS project_id,
      p.name AS project_name,
      p.status AS project_status,
      p.priority AS project_priority,
      COALESCE(js.ready, 0) AS ready,
      COALESCE(js.done, 0) AS done,
      COALESCE(js.waiting, 0) AS waiting,
      COALESCE(js.running, 0) AS running,
      COALESCE(js.failed, 0) AS failed,
      COALESCE(js.total, 0) AS total
    FROM public.projectdependencies d
    JOIN public.projects p ON p.id = d.upstream
    LEFT JOIN LATERAL (
      SELECT
        COUNT(*) FILTER (WHERE j.status = 'ready') AS ready,
        COUNT(*) FILTER (WHERE j.status = 'done') AS done,
        COUNT(*) FILTER (WHERE j.status = 'waiting') AS waiting,
        COUNT(*) FILTER (WHERE j.status = 'running') AS running,
        COUNT(*) FILTER (WHERE j.status = 'failed') AS failed,
        COUNT(*) AS total
      FROM public.jobs j
      WHERE j.id_project = p.id
    ) js ON TRUE
    WHERE d.downstream = $1
  `;

  await req.client.query(query, [id])
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
