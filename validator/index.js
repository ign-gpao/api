const checkProjectSchema = require('./checkProjectSchema');
const checkIdsSchema = require('./checkIdsSchema');
const checkHostsSchema = require('./checkHostsSchema');
const checkProjectDependencies = require('./checkProjectDependencies');
const checkJobDependencies = require('./checkJobDependencies');

module.exports = {
  checkProjectSchema,
  checkIdsSchema,
  checkHostsSchema,
  checkProjectDependencies,
  checkJobDependencies,
};
