var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var handler = require('../zip-contents/handler');
var OV = require('../zip-contents/ovation');
var nock = require('nock');

describe('Ovation API wrapper', function() {
  describe('getResource', function() {

    let api_url = 'https://services.ovation.io';
    let token = 'api-token';
    let resource_id = 1;
    let resource_url = 'https://services.ovation.io/resources/1';

    afterEach(function() {
      nock.cleanAll();
    });

    it('should return Promise to the Resource', sinon.test(function(done) {
      let ovNock = nock(api_url, {
          reqheaders: {
            Authorization: 'Bearer ' + token,
            Accept: 'application/json'
          }
        })
        .get('/api/v1/resources/' + resource_id)
        .reply(200, {
          url: resource_url
        });

      OV.getResource(api_url, token, resource_id)
        .then((resource) => {
          expect(resource.url).to.equal(resource_url);
          done();
        });
    }));

    it('should reject on http error', sinon.test(function(done) {
      done();
    }));
  });
});