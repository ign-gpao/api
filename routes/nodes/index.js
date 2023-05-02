const router = require('express').Router();
const { body, query } = require('express-validator');

const validateParams = require('../../middlewares/validateParams');
const createErrorMsg = require('../../middlewares/createErrorMsg');
const validator = require('../../validator');
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
  body()
    .exists().withMessage(createErrorMsg.getMissingParameterMsg('body'))
    .custom(validator.checkHostsSchema)
    .withMessage(createErrorMsg.getInvalidHostsSchema()),
],
validateParams,
pgClient.open,
nodes.setNbActiveSessions,
pgClient.close,
returnMsg);

module.exports = router;
