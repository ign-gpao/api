const router = require('express').Router();

const maintenance = require('../../middlewares/maintenance');
const pgClient = require('../../middlewares/db/pgClient');
const returnMsg = require('../../middlewares/returnMsg');

router.get('/maintenance/cleanDatabase',
  pgClient.open,
  maintenance.cleanDatabase,
  pgClient.close,
  returnMsg);

module.exports = router;
