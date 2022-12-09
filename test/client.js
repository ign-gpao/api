// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const server = require('..');

// chai.use(chaiHttp);

// describe('Client', () => {
//   after((done) => {
//     server.close();
//     done();
//   });

//   describe('Get client', () => {
//     it('should get a file', (done) => {
//       chai.request(server)
//         .get('/api/client')
//         .end((err, res) => {
//           res.should.have.header('content-type');
//           res.header['content-type'].should.be.equal('application/octet-stream');
//           res.should.have.header('content-disposition');
//           res.header['content-disposition'].should.be.equal('attachment; filename=client.zip');
//           res.should.have.header('access-control-expose-headers');
//           res.header['access-control-expose-headers']
//             .should.be.equal('Content-Description,content-disposition');
//           res.should.have.header('content-length');
//           done();
//         });
//     });
//   });
// });
