var nock = require('nock');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var express = require('express');
var handler = require('../zip-contents/handler');
var OV = require('../zip-contents/ovation');
var RSVP = require('rsvp');

describe('handler.js', function() {
  describe('stream', function() {
    it('should create zip stream', sinon.test(function(done) {
      let token = 'api-token';

      let Zip = {
        append: function(source, data) {},
        finalize: function() {},
        pipe: function(dest) {}
      };

      let path = "my/path";
      let resource_id = 1;

      let api_url = 'https://myapi.example.com';

      // Ovation
      let resourceStream = new RSVP.Promise(function(resolve, reject) {
        resolve('resource-stream');
      });
      getResourceStream = this.stub(OV, 'getResourceStream')
        .withArgs(api_url, token, resource_id)
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
      body[path] = resource_id
      req = {
        body: body,
        get: function(name) {
          if (name === 'Authorization') {
            return token;
          }

          return null;
        }
      }

      res = {
        status: function(code) {
          return {
            attachment: function(n) {}
          }
        }
      };

      handler.resources(req, res, api_url, archiver)
        .then(() => {
          zip.verify();
          done();
        });
    }));
  });
});