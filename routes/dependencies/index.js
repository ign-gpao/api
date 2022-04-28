const router = require('express').Router();
const { param } = require('express-validator');

const validateParams = require('../../middlewares/validateParams');
const createErrorMsg = require('../../middlewares/createErrorMsg');
const dependencies = require('../../middlewares/dependencies');
const pgClient = require('../../middlewares/db/pgClient');
const returnMsg = require('../../middlewares/returnMsg');

router.get('/job/:id/dependencies', [
  param('id')
    .exists().withMessage(createErrorMsg.getMissingParameterMsg('id'))
    .isInt({ min: 1 })
    .withMessage(createErrorMsg.getInvalidParameterMsg('id')),
],
validateParams,
pgClient.open,
dependencies.getJobDependencies,
pgClient.close,
returnMsg);

router.get('/project/:id/dependencies', [
  param('id')
    .exists().withMessage(createErrorMsg.getMissingParameterMsg('id'))
    .isInt({ min: 1 })
    .withMessage(createErrorMsg.getInvalidParameterMsg('id')),
],
validateParams,
pgClient.open,
dependencies.getProjectDependencies,
pgClient.close,
returnMsg);

module.exports = router;
