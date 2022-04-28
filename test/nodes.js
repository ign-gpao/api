const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('..');

const should = chai.should();
chai.use(chaiHttp);

describe('Nodes', () => {
  after((done) => {
    server.close();
    done();
  });

  describe('Get nodes', () => {
    it('should return an array', (done) => {
      chai.request(server)
        .get('/api/nodes')
        .end((err, res) => {
          should.equal(err, null);
          res.should.have.status(200);
          res.body.should.be.an('array');
          done();
        });
    });
  });
});
