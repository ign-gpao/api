const router = require('express').Router();
const { body, param, query } = require('express-validator');

const validateParams = require('../../middlewares/validateParams');
const createErrorMsg = require('../../middlewares/createErrorMsg');
const validator = require('../../validator');
const project = require('../../middlewares/project');
const pgClient = require('../../middlewares/db/pgClient');
const returnMsg = require('../../middlewares/returnMsg');

router.put('/project',
  body()
    .exists().withMessage(createErrorMsg.getMissingParameterMsg('body'))
    .custom(validator.checkProjectSchema)
    .withMessage(createErrorMsg.getInvalidProjectSchema())
    .custom(validator.checkProjectDependencies)
    .withMessage(createErrorMsg.getInvalidProjectDependencies())
    .custom(validator.checkJobDependencies)
    .withMessage(createErrorMsg.getInvalidJobsDependencies()),
  validateParams,
  pgClient.open,
  project.insertProjectFromJson,
  pgClient.close,
  returnMsg);

router.get('/projects',
  pgClient.open,
  project.getAllProjects,
  pgClient.close,
  returnMsg);

router.get('/projects/status',
  pgClient.open,
  project.getProjectStatus,
  pgClient.close,
  returnMsg);

router.get('/project/:id', [
  param('id')
    .exists().withMessage(createErrorMsg.getMissingParameterMsg('id'))
    .isInt({ min: 1 })
    .withMessage(createErrorMsg.getInvalidParameterMsg('id')),
],
validateParams,
pgClient.open,
project.getProject,
pgClient.close,
returnMsg);

router.get('/project/:id/jobs', [
  param('id')
    .exists().withMessage(createErrorMsg.getMissingParameterMsg('id'))
    .isInt({ min: 1 })
    .withMessage(createErrorMsg.getInvalidParameterMsg('id')),
],
validateParams,
pgClient.open,
project.getJobsOfProject,
pgClient.close,
returnMsg);

router.post('/projects/setPriority',
  body()
    .exists().withMessage(createErrorMsg.getMissingParameterMsg('body'))
    .custom(validator.checkIdsSchema)
    .withMessage(createErrorMsg.getInvalidIdsSchema()),
  query('priority')
    .exists().withMessage(createErrorMsg.getMissingParameterMsg('priority'))
    .isIn(['low', 'normal', 'high'])
    .withMessage(createErrorMsg.getInvalidParameterMsg('priority')),
  validateParams,
  pgClient.open,
  project.setPriority,
  pgClient.close,
  returnMsg);

router.delete('/projects/delete',
  body()
    .exists().withMessage(createErrorMsg.getMissingParameterMsg('body'))
    .custom(validator.checkIdsSchema)
    .withMessage(createErrorMsg.getInvalidIdsSchema()),
  validateParams,
  pgClient.open,
  project.deleteProjects,
  pgClient.close,
  returnMsg);

module.exports = router;
