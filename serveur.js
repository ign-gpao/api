const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const debug = require('debug');
const jobs = require('./routes/jobs');
const projects = require('./routes/projects');
const sessions = require('./routes/sessions');
const nodes = require('./routes/nodes');
const dependencies = require('./routes/dependencies');
// const client = require('./routes/client');
const maintenance = require('./routes/maintenance');

const API_PROTOCOL = process.env.GPAO_API_PROTOCOL || 'http';
const API_URL = process.env.GPAO_API_URL || 'localhost';
const API_PORT = process.env.GPAO_API_PORT || 8080;

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '500mb', extended: true }));

app.use((req, res, next) => {
  debug.log(req.method, ' ', req.path, ' ', req.body);
  debug.log(`received at ${Date.now()}`);
  next();
});

const options = {
  explorer: false,
};

const swaggerDocument = YAML.load('./doc/swagger.yml');
swaggerDocument.servers[0].url = `${API_PROTOCOL}://${API_URL}:${API_PORT}/api`;
swaggerDocument.info.version = process.env.npm_package_version;

app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

app.use('/api', jobs);
app.use('/api', projects);
app.use('/api', sessions);
app.use('/api', nodes);
app.use('/api', dependencies);
// app.use('/api', client);
app.use('/api/', maintenance);

module.exports = app.listen(API_PORT, () => {
  debug.log(`URL de l'api : ${API_PROTOCOL}://${API_URL}:${API_PORT}/api`);
  debug.log(`URL de la documentation swagger : ${API_PROTOCOL}://${API_URL}:${API_PORT}/api/doc`);
  debug.log(`Version de l'api : ${process.env.npm_package_version}`);
});
