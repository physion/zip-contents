var nock = require('nock');

var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var app = require('../zip-contents/app');
var sinon = require('sinon');
var jwt = require('jsonwebtoken');

var config = require('../zip-contents/config');
var handler = require('../zip-contents/handler');


chai.use(chaiHttp);


describe('Routes', function() {
  describe('POST /api/v1/resources', function() {
    let token = jwt.sign({}, config.JWT_SECRET);

    it('should call handler.resources', sinon.test(function(done) {
      var resources = this.stub(handler, 'resources', (req, res, archiver) => {
        res.status(201).send('ZIP');
      });

      chai.request(app)
        .post('/api/v1/resources')
        .set('Authorization', 'Bearer ' + token)
        .send({
          '/path/foo': 'rsrc1-id',
          '/path/foo/bar': 'rsrc2-id'
        })
        .end(function(err, res) {
          expect(resources).to.have.been.called;
          done();
        });
    }));

    it('should respond with 401 for missing JWT', sinon.test(function(done) {
      chai.request(app)
        .post('/api/v1/resources')
        .send({
          '/path/foo': 'rsrc1-id',
          '/path/foo/bar': 'rsrc2-id'
        })
        .end(function(err, res) {
          expect(res.status).to.eq(401);
          done();
        });
    }));

    it('shoudl respond with 401 for invalid JWT', sinon.test(function(done) {
      chai.request(app)
        .post('/api/v1/resources')
        .set('Authorization', 'Bearer ' + 'foo')
        .send({
          '/path/foo': 'rsrc1-url',
          '/path/foo/bar': 'rsrc2-url'
        })
        .end(function(err, res) {
          expect(res.status).to.eq(401);
          done();
        });
    }));
  })
});