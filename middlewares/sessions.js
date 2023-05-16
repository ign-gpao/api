const { matchedData } = require('express-validator');
const debug = require('debug')('session');

async function getAllSessions(req, res, next) {
  await req.client.query('SELECT * FROM view_sessions')
    .then((results) => { req.result = results.rows; })
    .catch((error) => {
      req.error = {
        msg: error.toString(),
        code: 500,
        function: 'getAllSessions',
      };
    });
  next();
}

async function getSessionStatus(req, res, next) {
  await req.client.query('SELECT * FROM view_sessions_status')
    .then((results) => { req.result = results.rows; })
    .catch((error) => {
      req.error = {
        msg: error.toString(),
        code: 500,
        function: 'getSessionStatus',
      };
    });
  next();
}

async function insertSession(req, res, next) {
  const params = matchedData(req);

  const { host } = params;
  const { tags } = params;

  await req.client.query(
    'INSERT INTO sessions (host, tags, start_date) VALUES ( $1 , $2, NOW()) RETURNING id',
    [host, tags ? tags.split(',') : []],
  )
    .then((results) => { req.result = results.rows; })
    .catch((error) => {
      req.error = {
        msg: error.toString(),
        code: 500,
        function: 'insertSession',
      };
    });
  next();
}

async function closeSession(req, res, next) {
  debug('closeSession');
  const params = matchedData(req);

  const { id } = params;
  debug(id);

  await req.client.query(
    "UPDATE sessions SET status = 'closed', end_date=NOW() WHERE id=$1",
    [id],
  )
    .catch((error) => {
      debug(error);
      req.error = {
        msg: error.toString(),
        code: 500,
        function: 'closeSession',
      };
    });
  next();
  debug('fin');
}

async function cleanUnused(req, res, next) {
  await req.client.query('SELECT clean_unused_session() as nb_sessions')
    .then((results) => { req.result = results.rows; })
    .catch((error) => {
      req.error = {
        msg: error.toString(),
        code: 500,
        function: 'cleanUnused',
      };
    });
  next();
}

async function closeSessionByHostname(req, res, next) {
  debug('closeSessionByHostname');
  const params = matchedData(req);

  const { hostname } = params;
  debug(hostname);

  await req.client.query('SELECT clean_old_session($1) AS nb_sessions', [hostname])
    .then((results) => { req.result = results.rows; })
    .catch((error) => {
      debug(error);
      req.error = {
        msg: error.toString(),
        code: 500,
        function: 'closeSessionByHostname',
      };
    });
  next();
  debug('fin');
}

async function getSessionByHostname(req, res, next) {
  debug('getSessionByHostname');
  const params = matchedData(req);

  const { hostname } = params;
  debug(hostname);

  await req.client.query('SELECT * FROM sessions WHERE host LIKE $1 ORDER BY id', [hostname])
    .then((results) => { req.result = results.rows; })
    .catch((error) => {
      debug(error);
      req.error = {
        msg: error.toString(),
        code: 500,
        function: 'getSessionByHostname',
      };
    });
  next();
  debug('fin');
}

module.exports = {
  getAllSessions,
  getSessionStatus,
  insertSession,
  closeSession,
  cleanUnused,
  closeSessionByHostname,
  getSessionByHostname,
};
