const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('..');

const should = chai.should();
chai.use(chaiHttp);
let idSession;
let idJob;

describe('Jobs', () => {
  before((done) => {
    // on ajoute une ressource
    const hostname = String(Date.now());
    chai.request(server)
      .put('/api/session')
      .query({ host: hostname })
      .end((err, res) => {
        should.equal(err, null);
        res.should.have.status(200);
        res.body.should.be.an('array');
        idSession = res.body[0].id;
        // activation de la ressource
        chai.request(server)
          .post('/api/node/setNbActive')
          .query({ value: 1 })
          .send({
            hosts: [hostname],
          })
          .end((err2, res2) => {
            should.equal(err2, null);
            res2.should.have.status(200);
            // ajout d'un projet
            chai.request(server)
              .put('/api/project')
              .send({
                projects: [
                  {
                    name: 'Chantier 1',
                    jobs: [
                      {
                        name: 'jobs 1',
                        command: 'touch file1',
                      },
                    ],
                  },
                ],
              })
              .end((err3, res3) => {
                should.equal(err3, null);
                res3.should.have.status(200);
                done();
              });
          });
      });
  });

  after((done) => {
    server.close();
    done();
  });

  describe('Get jobs', () => {
    it('should return an array', (done) => {
      chai.request(server)
        .get('/api/jobs')
        .end((err, res) => {
          should.equal(err, null);
          res.should.have.status(200);
          res.body.should.be.an('array');
          done();
        });
    });
  });

  describe('Get job/ready', () => {
    it('should return an error', (done) => {
      chai.request(server)
        .get('/api/job/ready')
        .query({ id_session: -1 })
        .end((err, res) => {
          should.equal(err, null);
          res.should.have.status(400);
          res.body.status.should.equal("Le paramètre 'id_session' est invalide.");
          done();
        });
    });
  });

  describe('Get job/ready', () => {
    it('should return an array', (done) => {
      chai.request(server)
        .get('/api/job/ready')
        .query({ id_session: idSession })
        .end((err, res) => {
          should.equal(err, null);
          res.should.have.status(200);
          res.body.should.be.an('array');
          idJob = res.body[0].id;
          done();
        });
    });
  });

  describe('Post job', () => {
    it('should return an error', (done) => {
      chai.request(server)
        .post('/api/job')
        .query({ id: -1, status: 'failed', returnCode: 0 })
        .send({ log: 'string' })
        .end((err, res) => {
          should.equal(err, null);
          res.should.have.status(400);
          res.body.status.should.equal("Le paramètre 'id' est invalide.");
          done();
        });
    });
  });

  describe('Post job', () => {
    it('should return succeed', (done) => {
      chai.request(server)
        .post('/api/job')
        .query({ id: idJob, status: 'failed', returnCode: 0 })
        .send({ log: 'string' })
        .end((err, res) => {
          should.equal(err, null);
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('Reinit job', () => {
    it('should return succeed', (done) => {
      chai.request(server)
        .post('/api/jobs/reinit')
        .send({ ids: [idJob] })
        .end((err, res) => {
          should.equal(err, null);
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('Get job/status', () => {
    it('should return an array', (done) => {
      chai.request(server)
        .get('/api/jobs/status')
        .end((err, res) => {
          should.equal(err, null);
          res.should.have.status(200);
          res.body.should.be.an('array');
          done();
        });
    });
  });
});

describe('Get job/:id', () => {
  it('should return an array', (done) => {
    chai.request(server)
      .get(`/api/job/${idJob}`)
      .end((err, res) => {
        should.equal(err, null);
        res.should.have.status(200);
        res.body.should.be.an('array');
        done();
      });
  });
});

describe('Append job log', () => {
  it('should return succeed', (done) => {
    chai.request(server)
      .post(`/api/job/${idJob}/appendLog`)
      .send({ log: 'test append' })
      .end((err, res) => {
        should.equal(err, null);
        res.should.have.status(200);
        done();
      });
  });
});

describe('Append job log with wrong id (-1)', () => {
  it('should failed', (done) => {
    chai.request(server)
      .post('/api/job/-1/appendLog')
      .send({ log: 'test append' })
      .end((err, res) => {
        should.equal(err, null);
        res.should.have.status(400);
        done();
      });
  });
});

describe('Append job log with wrong id (999)', () => {
  it('should failed', (done) => {
    chai.request(server)
      .post('/api/job/999/appendLog')
      .send({ log: 'test append' })
      .end((err, res) => {
        should.equal(err, null);
        res.should.have.status(404);
        done();
      });
  });
});
