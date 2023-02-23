const router = require('express').Router();
const { body, query } = require('express-validator');

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

router.post('/node/setNbActive',
  query('value')
    .exists().withMessage(createErrorMsg.getMissingParameterMsg('value'))
    .isInt({ min: 0 })
    .withMessage(createErrorMsg.getInvalidParameterMsg('value')),
  body('hosts')
    .exists().withMessage(createErrorMsg.getMissingParameterMsg('hosts')),
validateParams,
pgClient.open,
nodes.setNbActiveSessions,
pgClient.close,
returnMsg);

module.exports = router;
