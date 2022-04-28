const { matchedData } = require('express-validator');
const debug = require('debug')('nodes');

async function getAllNodes(req, res, next) {
  debug('getAllNodes');
  await req.client.query('SELECT host, status, count(*) FROM sessions S GROUP BY host, status')
    .then((results) => {
      const dict = {};
      results.rows.forEach((row) => {
        dict[row.host] = dict[row.host] === undefined ? {
          host: row.host, closed: 0, active: 0, idle: 0, running: 0,
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

async function setNbActiveNodes(req, res, next) {
  debug('setNbActiveNodes');
  const params = matchedData(req);
  const { host } = params;
  const { limit } = params;
  debug(`host = ${host}`);
  debug(`limit = ${limit}`);
  await req.client.query('SELECT set_nb_active_nodes ($1, $2)', [host, limit])
    .catch((error) => {
      req.error = {
        msg: error.toString(),
        code: 500,
        function: 'setNbActiveNodes',
      };
    });
  next();
  debug('fin');
}

module.exports = {
  getAllNodes,
  setNbActiveNodes,
};
