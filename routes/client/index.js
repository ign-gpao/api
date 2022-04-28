const router = require('express').Router();

const client = require('../../middlewares/client');
const returnMsg = require('../../middlewares/returnMsg');

router.get('/client',
  client.getClient,
  returnMsg);

module.exports = router;
