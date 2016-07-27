var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var sinon = require('sinon')
var app = require('../app/app');

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
        .then(function (res) {
          expect(res).to.have.status(201);
          expect(res).to.have.header('content-type', 'application/zip');
          // expect(res).to.be.zip;

          // res.body.should.be.a('object');
          // res.body.should.have.property('SUCCESS');
          // res.body.SUCCESS.should.be.a('object');
          // res.body.SUCCESS.should.have.property('name');
          // res.body.SUCCESS.should.have.property('lastName');
          // res.body.SUCCESS.should.have.property('_id');
          // res.body.SUCCESS.name.should.equal('Java');
          // res.body.SUCCESS.lastName.should.equal('Script');
        })
        .catch(function (err) {
          throw err;
        });
    })
  })
});