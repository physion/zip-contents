var nock = require('nock');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');


var handler = require('../zip-contents/handler');
var OV = require('../zip-contents/ovation');


describe('Ovation API wrapper', sinon.test(function() {

  let api_url = 'https://services.ovation.io';
  let token = 'api-token';

  afterEach(function() {
    nock.cleanAll();
  });

  describe('getResourceGroup', function() {
    let groupId = 1;
    let groupName = 'Some Group';

    it('should return Promise to the ResourceGroup', sinon.test(function(done) {
      let ov = nock(api_url)
        .matchHeader('authorization', token)
        .matchHeader('accept', 'application/json')
        .get('/api/v1/resource_groups/' + groupId)
        .reply(200, {
          name: groupName,
          id: groupId
        });



      OV.getResourceGroup(token, api_url, groupId)
        .then((grp) => {
          expect(grp["id"]).to.equal(groupId);
          ov.done();
          done();
        });
    }));
  });

  describe('getResource', function() {
    let resource_id = 1;
    let resource_url = 'https://services.ovation.io/resources/1';

    afterEach(function() {
      nock.cleanAll();
    });

    it('should return Promise to the Resource', sinon.test(function(done) {
      let ov = nock(api_url)
        .matchHeader('authorization', token)
        .matchHeader('accept', 'application/json')
        .get('/resources/' + resource_id) // + '?token=' + token)
        .reply(200, {
          url: resource_url
        });



      OV.getResource(token, resource_url)
        .then((resource) => {
          expect(resource["url"]).to.equal(resource_url);
          ov.done();
          done();
        });
    }));

    it('should handle remote URLs [#136523379]', sinon.test(function(done) {
      let resource_url = 'https://www.example.com/remote-url';
      
      OV.getResource(token, resource_url)
        .then((resource) => {
          expect(resource["url"]).to.equal(resource_url);
          done();
        });
    }));

    it('should reject on http error', sinon.test(function(done) {
      let ov = nock(api_url)
        .matchHeader('authorization', token)
        .matchHeader('accept', 'application/json')
        .get('/api/v1/resources/' + resource_id)
        .reply(404);



      OV.getResource(token, 'https://services.ovation.io/resources/' + resource_id)
        .catch((error) => {
          done();
        });
    }));
  });
}));