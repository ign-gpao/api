const { matchedData } = require('express-validator');
const debug = require('debug')('nodes');

async function getAllNodes(req, res, next) {
  debug('getAllNodes');
  await req.client.query('SELECT host, status, count(*) FROM sessions S GROUP BY host, status')
    .then((results) => {
      const dict = {};
      results.rows.forEach((row) => {
        dict[row.host] = dict[row.host] === undefined ? {
          host: row.host, closed: 0, active: 0, idle: 0, idle_requested: 0, running: 0,
        } : dict[row.host];
        dict[row.host][row.status] = row.count;
      });
      const array = [];

      Object.keys(dict).forEach((key) => {
        array.push(dict[key]);
      });
      req.result = array;
    })
    .catch((error) => {
      req.error = {
        msg: error.toString(),
        code: 500,
        function: 'getAllSessions',
      };
    });
  next();
  debug('fin');
}

async function setNbActiveSessions(req, res, next) {
  const params = matchedData(req);
  const { value } = params;
  const { hosts } = req.body;
  await req.client.query('SELECT set_nb_active_sessions ($1, $2)', [hosts, value])
    .catch((error) => {
      req.error = {
        msg: error.toString(),
        code: 500,
        function: 'setNbActiveSessions',
      };
    });
  next();
}

module.exports = {
  getAllNodes,
  setNbActiveSessions,
};
