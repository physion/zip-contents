var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var app = require('../zip-contents/app');
var sinon = require('sinon');
var handler = require('../zip-contents/handler');

chai.use(chaiHttp);


describe('Routes', function() {
  describe('POST /api/v1/resources', function() {
    let token = 'APITOKEN';
    
    afterEach(function() {
      sinon.restore();
    });

    it('should call handler.resources', sinon.test(function(done) {
      var resources = this.stub(handler, 'resources');

      chai.request(app)
        .post('/api/v1/resources')
        .set('Authorization', 'Bearer ' + token)
        .send({
          '/path/foo': 'rsrc1-id',
          '/path/foo/bar': 'rsrc2-id'
        })
        .end(function(err, res) {
          expect(resources).to.be.calledOnce();
          done();
        });
    }))
  })
});