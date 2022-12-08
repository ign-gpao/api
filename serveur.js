const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const os = require('os');

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

const PORT = process.env.API_PORT || 8080;

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
  debug.log(req.method, ' ', req.path, ' ', req.body);
  debug.log(`received at ${Date.now()}`);
  next();
});

const options = {
  explorer: false,
};

const swaggerDocument = YAML.load('./doc/swagger.yml');
const hostname = process.env.SERVER_HOSTNAME || os.hostname();
swaggerDocument.servers[0].url = `http://${hostname}:${PORT}/api`;
swaggerDocument.info.version = process.env.npm_package_version;

app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

app.use('/api', jobs);
app.use('/api', projects);
app.use('/api', sessions);
app.use('/api', nodes);
app.use('/api', dependencies);
// app.use('/api', client);
app.use('/api/', maintenance);

module.exports = app.listen(PORT, () => {
  debug.log(`URL de l'api : http://localhost:${PORT}/api`);
  debug.log(`URL de la documentation swagger : http://localhost:${PORT}/api/doc`);
  debug.log(`Version de l'api : ${process.env.npm_package_version}`);
});
