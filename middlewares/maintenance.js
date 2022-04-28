const debug = require('debug')('nodes');

async function cleanDatabase(req, res, next) {
  debug('cleanDatabase');
  await req.client.query('SELECT clean_database()')
    .catch((error) => {
      req.error = {
        msg: error.toString(),
        code: 500,
        function: 'cleanDatabase',
      };
    });
  next();
  debug('fin');
}

module.exports = {
  cleanDatabase,
};
