var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var app = require('../zip-contents/app');

chai.use(chaiHttp);


describe('zip-contents', function () {
  describe('POST /api/v1/stream', function () {
    let token = 'APITOKEN';

    it('should return a zip stream', function (done) {
      chai.request(app)
        .post('/api/v1/stream')
        .set('Authorization', 'Bearer ' + token)
        .send({
          '/path/foo': 'rev1-id',
          '/path/foo/bar': 'rev2-id'
        })
        .end(function(err, res) {
          expect(res).to.have.status(201);
          expect(res).to.have.header('content-type', 'application/zip');
          
          done();
        });
    })
  })
});