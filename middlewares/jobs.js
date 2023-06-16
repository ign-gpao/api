const { matchedData } = require('express-validator');
const debug = require('debug')('job');

async function getAllJobs(req, res, next) {
  await req.client.query('SELECT * FROM view_jobs')
    .then((results) => { req.result = results.rows; })
    .catch((error) => {
      req.error = {
        msg: error.toString(),
        code: 500,
        function: 'getAlljobs',
      };
    });
  next();
}

async function getJobStatus(req, res, next) {
  await req.client.query('SELECT * FROM view_job_status')
    .then((results) => { req.result = results.rows; })
    .catch((error) => {
      req.error = {
        msg: error.toString(),
        code: 500,
        function: 'getJobStatus',
      };
    });
  next();
}

async function getJob(req, res, next) {
  const params = matchedData(req);

  const { id } = params;
  await req.client.query('SELECT * FROM view_job WHERE job_id=$1', [id])
    .then((results) => { req.result = results.rows; })
    .catch((error) => {
      req.error = {
        msg: error.toString(),
        code: 500,
        function: 'getJob',
      };
    });
  next();
}

async function getJobReady(req, res, next) {
  const params = matchedData(req);

  const id = params.id_session;
  try {
    // await req.client.query('LOCK TABLE jobs IN EXCLUSIVE MODE');
    await req.client.query(
      'SELECT to_json(assign_first_job_ready_for_session($1))', [id],
    )
      .then((results) => {
        debug(results.rows);
        req.result = [];
        if (results.rowCount > 0) {
          req.result.push(results.rows[0].to_json);
        }
      });
  } catch (error) {
    req.error = {
      msg: error.toString(),
      code: 500,
      function: 'getJobReady',
    };
  }
  next();
}

async function updateJobStatus(req, res, next) {
  const params = matchedData(req);
  const { id } = params;
  const { status } = params;
  const { returnCode } = params;
  const { log } = params;

  debug(`id = ${id}`);
  debug(`status = ${status}`);
  debug(`returnCode = ${returnCode}`);
  debug(`log = ${log}`);

  await req.client.query(
    'UPDATE jobs SET status = $1, log = CONCAT( log, CAST($2 AS VARCHAR) ), return_code = $4, end_date=NOW() WHERE id = $3', [status, log, id, returnCode],
  )
    .then((results) => {
      if (results.rowCount !== 1) {
        req.error = {
          msg: `Invalid Job Id : ${id}`,
          code: 404,
          function: 'appendLog',
        };
      } else {
        req.result = results.rows;
      }
    })
    .catch((error) => {
      req.error = {
        msg: error.toString(),
        code: 500,
        function: 'updateJobStatus',
      };
    });
  next();
}

async function reinitJobs(req, res, next) {
  const { ids } = req.body;

  await req.client.query(
    'SELECT reinit_jobs($1::integer[]) AS nb_jobs', [ids],
  )
    .then((results) => { req.result = results.rows; })
    .catch((error) => {
      req.error = {
        msg: error.toString(),
        code: 500,
        function: 'reinitJobs',
      };
    });
  next();
}

async function setTags(req, res, next) {
  const { ids } = req.body;
  const params = matchedData(req);
  let { tags } = params;
  try {
    tags = tags.split(',');
  } catch {
    tags = [];
  }
  await req.client.query('UPDATE jobs SET tags=$1 WHERE id = ANY($2::int[]) AND status = ANY($3::status[])',
    [tags, ids, ['ready', 'waiting', 'failed']])
    .then((results) => {
      req.result = results.rows;
    })
    .catch((error) => {
      req.error = {
        msg: error.toString(),
        code: 404,
        function: 'setTags',
      };
    });
  next();
}

async function appendLog(req, res, next) {
  const params = matchedData(req);
  const { id } = params;
  const { log } = params;

  debug(`id = ${id}`);
  debug(`log = ${log}`);

  await req.client.query(
    'UPDATE jobs SET log = CONCAT( log, CAST($2 AS VARCHAR) ) WHERE id = $1', [id, log],
  )
    .then((results) => {
      if (results.rowCount !== 1) {
        req.error = {
          msg: `Invalid Job Id : ${id}`,
          code: 404,
          function: 'appendLog',
        };
      } else {
        req.result = results.rows;
      }
    })
    .catch((error) => {
      debug(error);
      req.error = {
        msg: error.toString(),
        code: 500,
        function: 'appendLog',
      };
    });
  next();
}

module.exports = {
  getAllJobs,
  getJobStatus,
  getJobReady,
  getJob,
  updateJobStatus,
  reinitJobs,
  setTags,
  appendLog,
};
