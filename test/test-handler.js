var nock = require('nock');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var express = require('express');
var handler = require('../zip-contents/handler');
var OV = require('../zip-contents/ovation');
var RSVP = require('rsvp');
var config = require('../zip-contents/config');

RSVP.on('error', function(reason) {
  console.log("Error: " + reason);
});

describe('handler.js', function() {

  afterEach(() => {
    sinon.restore
  });

  beforeEach(() => {
    nock.cleanAll();
  })

  describe('resource_groups', function() {
    it('should create a zip stream', sinon.test(function(done) {
      let token = 'api-token';
      let bearerToken = "Bearer " + token;

      let Zip = {
        append: function(source, data) {},
        finalize: function() {},
        pipe: function(dest) {}
      };

      let resource_group_id = 1;
      let resource_group_name = 'group-name';
      let resource_name = 'resource-name';
      let resource_id = 1;

      let resource_url_base = 'https://resources.example.com/'; 
      let resource_url = resource_url_base + resource_id;
      let services_url = config.SERVICES_API;

      // Ovation
      let ovGroup = nock(services_url)
        .matchHeader('authorization', 'Bearer ' + token)
        .matchHeader('accept', 'application/json')
        .get('/api/v1/resource_groups/' + resource_group_id)
        .reply(200, {
          resource_group: {
            name: resource_group_name,
            id: resource_group_id,
            resources: [resource_id]
          },
          resources: [{
            name: resource_name,
            url: services_url + "/resources/" + resource_id
          }]
        });


      let ovResource = nock(services_url)
        .matchHeader('authorization', 'Bearer ' + token)
        .matchHeader('accept', 'application/json')
        .get('/resources/' + resource_id)
        .reply(200, {
          url: resource_url
        });

      let ovResourceUrl = nock(resource_url_base)
        .get('/' + resource_id)
        .reply(200, 'CONTENTS!');



      // Archiver
      archiver = sinon.stub();
      zip = this.mock(Zip);
      archiver.withArgs('zip').returns(zip.object);
      zip.expects('finalize').once();
      zip.expects('append').once();
      zip.expects('pipe').once();


      // Express
      req = {
        params: {
          id: resource_group_id
        },
        headers: {
          authorization: bearerToken
        }
      }

      res = {
        status: function(code) {
          return {
            attachment: function(n) {}
          }
        }
      };

      handler.resource_groups(req, res, archiver)
        .then((res) => {
          zip.verify();
          ovGroup.done();
          ovResource.done();
          done();
        });
    }));
  });

  describe('resources', function() {
    it('should create zip stream', sinon.test(function(done) {
      let token = 'api-token';
      let bearerToken = "Bearer " + token;

      let Zip = {
        append: function(source, data) {},
        finalize: function() {},
        pipe: function(dest) {}
      };

      let path = "my/path";
      let resource_id = 1;
      let resource_url = 'https://resources.example.com/' + resource_id;

      // Ovation
      let resourceStream = new RSVP.Promise(function(resolve, reject) {
        resolve('resource-stream');
      });
      getResourceStream = this.stub(OV, 'getResourceStream')
        .withArgs(bearerToken, resource_url)
        .returns(resourceStream);


      // Archiver
      archiver = sinon.stub();
      zip = this.mock(Zip);
      archiver.withArgs('zip').returns(zip.object);
      zip.expects('finalize').once();
      zip.expects('append').withArgs('resource-stream', {
        name: path
      }).once();
      zip.expects('pipe').once();


      // Express
      let body = {};
      body[path] = resource_url
      req = {
        body: body,
        headers: {
          authorization: bearerToken
        }
      }

      res = {
        status: function(code) {
          return {
            attachment: function(n) {}
          }
        }
      };

      handler.resources(req, res, archiver)
        .then(() => {
          zip.verify();
          done();
        });
    }));
  });
});