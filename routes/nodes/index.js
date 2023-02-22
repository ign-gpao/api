const router = require('express').Router();
const {
  query,
} = require('express-validator');

const validateParams = require('../../middlewares/validateParams');
const createErrorMsg = require('../../middlewares/createErrorMsg');
const nodes = require('../../middlewares/nodes');
const pgClient = require('../../middlewares/db/pgClient');
const returnMsg = require('../../middlewares/returnMsg');

router.get('/nodes',
  pgClient.open,
  nodes.getAllNodes,
  pgClient.close,
  returnMsg);

router.post('/node/setNbActive', [
  query('value')
    .exists().withMessage(createErrorMsg.getMissingParameterMsg('value'))
    .isInt({ min: 0 })
    .withMessage(createErrorMsg.getInvalidParameterMsg('value')),
],
validateParams,
pgClient.open,
nodes.setNbActiveSessions,
pgClient.close,
returnMsg);

module.exports = router;
