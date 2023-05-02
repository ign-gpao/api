const router = require('express').Router();
const {
  query, body, param,
} = require('express-validator');

const validateParams = require('../../middlewares/validateParams');
const createErrorMsg = require('../../middlewares/createErrorMsg');
const validator = require('../../validator');
const jobs = require('../../middlewares/jobs');
const pgClient = require('../../middlewares/db/pgClient');
const returnMsg = require('../../middlewares/returnMsg');

router.get('/job/ready', [
  query('id_session')
    .exists().withMessage(createErrorMsg.getMissingParameterMsg('id_session'))
    .isInt({ min: 1 })
    .withMessage(createErrorMsg.getInvalidParameterMsg('id_session')),
],
validateParams,
pgClient.open,
jobs.getJobReady,
pgClient.close,
returnMsg);

router.get('/job/:id', [
  param('id')
    .exists().withMessage(createErrorMsg.getMissingParameterMsg('id'))
    .isInt({ min: 1 })
    .withMessage(createErrorMsg.getInvalidParameterMsg('id')),
],
validateParams,
pgClient.open,
jobs.getJob,
pgClient.close,
returnMsg);

router.get('/jobs',
  pgClient.open,
  jobs.getAllJobs,
  pgClient.close,
  returnMsg);

router.get('/jobs/status',
  pgClient.open,
  jobs.getJobStatus,
  pgClient.close,
  returnMsg);

router.post('/jobs/reinit',
  body()
    .exists().withMessage(createErrorMsg.getMissingParameterMsg('body'))
    .custom(validator.checkIdsSchema)
    .withMessage(createErrorMsg.getInvalidIdsSchema()),
  validateParams,
  pgClient.open,
  jobs.reinitJobs,
  pgClient.close,
  returnMsg);

router.post('/job', [
  body('log').exists().withMessage(createErrorMsg.getMissingParameterMsg('log')),
  query('status')
    .exists().withMessage(createErrorMsg.getMissingParameterMsg('status'))
    .isIn(['done', 'failed', 'running'])
    .withMessage(createErrorMsg.getInvalidParameterMsg('status')),
  query('id')
    .exists().withMessage(createErrorMsg.getMissingParameterMsg('id'))
    .isInt({ min: 1 })
    .withMessage(createErrorMsg.getInvalidParameterMsg('id')),
  query('returnCode')
    .exists().withMessage(createErrorMsg.getMissingParameterMsg('returnCode'))
    .isInt()
    .withMessage(createErrorMsg.getInvalidParameterMsg('returnCode')),
],
validateParams,
pgClient.open,
jobs.updateJobStatus,
pgClient.close,
returnMsg);

router.post('/job/:id/appendLog', [
  body('log').exists().withMessage(createErrorMsg.getMissingParameterMsg('log')),
  param('id')
    .exists().withMessage(createErrorMsg.getMissingParameterMsg('id'))
    .isInt({ min: 1 })
    .withMessage(createErrorMsg.getInvalidParameterMsg('id')),
],
validateParams,
pgClient.open,
jobs.appendLog,
pgClient.close,
returnMsg);

module.exports = router;
