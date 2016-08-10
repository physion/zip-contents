var nock = require('nock');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var express = require('express');
var handler = require('../zip-contents/handler');
var OV = require('../zip-contents/ovation');
var RSVP = require('rsvp');
var config = require('../zip-contents/config');
var util = require('../zip-contents/util');

RSVP.on('error', function(reason) {
  console.log("Error: " + reason);
});

describe('handler.js', function() {

  afterEach(() => {
    sinon.restore
  });

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('activities', function() {
    it('should zip activity contents', sinon.test(function(done) {
      let token = 'api-token';
      let bearerToken = "Bearer " + token;

      let apiUrl = config.OR_API_URL;
      let activityId = 1;

      let inputsPath = '/api/v1/inputs/' + activityId;
      let outputsPath = '/api/v1/outputs/' + activityId;
      let actionsPath = '/api/v1/actions/' + activityId;

      let inputUrl = 'input-resource';
      let outputUrl = 'output-resource';
      let actionUrl = 'action-resource';

      let inputName = 'input-name';
      let outputName = 'output-name';
      let actionName = 'action-name';


      let ovActivity = nock(apiUrl)
        .matchHeader('authorization', 'Bearer ' + token)
        .matchHeader('accept', 'application/json')
        .get('/api/v1/activities/' + activityId)
        .reply(200, {
          activity: {
            _id: activityId,
            attributes: {
              name: "myactivity"
            },
            relationships: {
              inputs: {
                related: inputsPath
              },
              outputs: {
                related: outputsPath
              },
              actions: {
                related: actionsPath
              }
            }
          }
        });

      let ovInputs = nock(apiUrl)
        .matchHeader('authorization', 'Bearer ' + token)
        .matchHeader('accept', 'application/json')
        .get(inputsPath)
        .reply(200, {
          inputs: [{
            attributes: {
              url: inputUrl,
              name: inputName
            }
          }]
        });

      let ovOutputs = nock(apiUrl)
        .matchHeader('authorization', 'Bearer ' + token)
        .matchHeader('accept', 'application/json')
        .get(outputsPath)
        .reply(200, {
          outputs: [{
            attributes: {
              url: outputUrl,
              name: outputName
            }
          }]
        });

      let ovActions = nock(apiUrl)
        .matchHeader('authorization', 'Bearer ' + token)
        .matchHeader('accept', 'application/json')
        .get(actionsPath)
        .reply(200, {
          actions: [{
            attributes: {
              url: actionUrl,
              name: actionName
            }
          }]
        });

      // Express
      req = {
        params: {
          id: activityId
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

      // Archiver
      let archiver = sinon.stub();

      // Zip
      let expectedUrls = {};
      expectedUrls['/inputs/' + inputName] = inputUrl;
      expectedUrls['/outputs/' + outputName] = outputUrl;
      expectedUrls['/actions/' + actionName] = actionUrl;

      let zip = this.stub(handler, 'zipResources')
        .returns('done');

      handler.activities(req, res, archiver)
        .then((res) => {
          let args = zip.firstCall.args[1];
          for (let [k, v] of util.entries(args)) {
            expect(expectedUrls[k]).to.equal(v);
          }

          ovInputs.done();
          ovOutputs.done();
          ovActions.done();
          done();
        })
        .catch((err) => {
          console.write("Error: " + err);
          done();
        });

    }));
  });

  describe('folders', function() {
    it('should zip folder contents', sinon.test(function(done) {
      let token = 'api-token';
      let bearerToken = "Bearer " + token;

      let apiUrl = config.OR_API_URL;
      let folderId = 1;
      let subFolderId = 2;

      let filesPath = '/api/v1/files/' + folderId;
      let foldersPath = '/api/v1/folders/' + folderId;
      let subFilesPath = '/api/v1/files/' + subFolderId;
      let subFoldersPath = '/api/v1/folders' + subFolderId;
      let headsPath = '/api/v1/files/heads';
      let subHeadsPath = '/api/v1/files/heads';

      let fileUrl = 'file-resource';
      let subFileUrl = 'subfile-resource';

      let fileName = 'file-name';
      let subFileName = 'subfile-name';


      let ovFolder = nock(apiUrl)
        .matchHeader('authorization', 'Bearer ' + token)
        .matchHeader('accept', 'application/json')
        .get('/api/v1/folders/' + folderId)
        .reply(200, {
          folder: {
            _id: folderId,
            attributes: {
              name: "folder"
            },
            relationships: {
              files: {
                related: filesPath
              },
              folders: {
                related: foldersPath
              },
            }
          }
        });

      let ovFiles = nock(apiUrl)
        .matchHeader('authorization', 'Bearer ' + token)
        .matchHeader('accept', 'application/json')
        .get(filesPath)
        .reply(200, {
          files: [{
            _id: 'file-id',
            attributes: {
              name: fileName
            },
            links: {
              heads: headsPath
            }
          }]
        });

      let ovHeads = nock(apiUrl)
        .matchHeader('authorization', 'Bearer ' + token)
        .matchHeader('accept', 'application/json')
        .get(headsPath)
        .reply(200, {
          revisions: [{
            _id: 'rev-id',
            attributes: {
              name: fileName,
              url: fileUrl
            }
          }]
        });

      let ovFolders = nock(apiUrl)
        .matchHeader('authorization', 'Bearer ' + token)
        .matchHeader('accept', 'application/json')
        .get(foldersPath)
        .reply(200, {
          folders: [{
            attributes: {
              name: "subfolder"
            },
            relationships: {
              files: {
                related: subFilesPath
              },
              folders: {
                related: subFoldersPath
              },
            }
          }]
        });

      let ovSubFolders = nock(apiUrl)
        .matchHeader('authorization', 'Bearer ' + token)
        .matchHeader('accept', 'application/json')
        .get(subFoldersPath)
        .reply(200, {
          folders: []
        });

      let ovSubFiles = nock(apiUrl)
        .matchHeader('authorization', 'Bearer ' + token)
        .matchHeader('accept', 'application/json')
        .get(subFilesPath)
        .reply(200, {
          files: [{
            _id: 'sub-file-id',
            attributes: {
              name: subFileName
            },
            links: {
              heads: subHeadsPath
            }
          }]
        });

      let ovSubHeads = nock(apiUrl)
        .matchHeader('authorization', 'Bearer ' + token)
        .matchHeader('accept', 'application/json')
        .get(subHeadsPath)
        .reply(200, {
          revisions: [{
            _id: 'rev-id',
            attributes: {
              name: subFileName,
              url: subFileUrl
            }
          }]
        });

      // Express
      req = {
        params: {
          id: folderId
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

      // Archiver
      let archiver = sinon.stub();

      // Zip
      let expectedUrls = {};
      expectedUrls['/folder/' + fileName] = fileUrl;
      expectedUrls['/folder/subfolder/' + subFileName] = subFileUrl;

      let zip = this.stub(handler, 'zipResources')
        .returns('done');

      handler.folders(req, res, archiver)
        .then((res) => {
          let args = zip.firstCall.args[1];
          for (let [k, v] of util.entries(args)) {
            expect(expectedUrls[k]).to.equal(v);
          }

          ovFolder.done();
          ovFiles.done();
          ovHeads.done();
          ovFolders.done();
          ovSubFolders.done();
          ovSubFiles.done();
          ovSubHeads.done();

          done();
        })
        .catch((err) => {
          console.write("Error: " + err);
          done();
        });

    }));
  });

  describe('resource_groups', function() {
    it('should create a zip stream', sinon.test(function(done) {
      let token = 'api-token';
      let bearerToken = "Bearer " + token;

      let resource_group_id = 1;
      let resource_group_name = 'group-name';
      let resource_name = 'resource-name';
      let resource_id = 1;

      let services_url = config.SERVICES_API;
      let resource_url = services_url + "/resources/" + resource_id


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

      let resourceStream = new RSVP.Promise(function(resolve, reject) {
        resolve('resource-stream');
      });
      getResourceStream = this.stub(OV, 'getResourceStream')
        .withArgs(bearerToken, resource_url)
        .returns(resourceStream);


      // Archiver
      let archiver = sinon.stub();

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

      // Zip
      let expectedUrls = {};
      let expectedPath = "/" + resource_group_name + "/" + resource_name;
      expectedUrls[expectedPath] = resource_url;

      let zip = this.stub(handler, 'zipResources')
        .returns('done');

      handler.resource_groups(req, res, archiver)
        .then((res) => {
          expect(zip.firstCall.args[1][expectedPath]).to.equal(resource_url);
          ovGroup.done();
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