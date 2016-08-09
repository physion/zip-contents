/*
Handlers for API requests
*/

var OV = require('./ovation');
var RSVP = require('rsvp');
var config = require('./config')
var util = require('./util');

var local = {
  bearerToken(req) {
    var parts = req.headers.authorization.split(' ');
    if (parts.length == 2) {
      var scheme = parts[0];
      var credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        return credentials;
      }
    }

    return null;
  }
};

var handler = {

  zipResources(token, urls, archiver, dest) {
    let zip = archiver('zip');

    futureStreams = [];
    for (let [path, resource_url] of util.entries(urls)) {
      let p = OV.getResourceStream(token, resource_url)
        .then(function(resourceStream) {
          zip.append(resourceStream, {
            name: path
          });
        });

      futureStreams.push(p);
    }

    return RSVP.all(futureStreams)
      .then(function(streams) {
        zip.finalize();
        zip.pipe(dest);
      });
  },

  resources(req, res, archiver) {

    let authToken = req.headers.authorization;

    let name = (req.params && req.params.name) ? req.params.name : 'resources';

    res.status(201).attachment(name + '.zip');
    
    return handler.zipResources(authToken, req.body, archiver, res);

  },

  resource_groups(req, res, archiver) {
    let authToken = req.headers.authorization;

    return OV.getResourceGroupUrls(authToken, config.SERVICES_API, req.params.id)
      .then((result) => {
        groupName = result.groupName;
        urls = result.urls;
        
        res.status(201).attachment(groupName + '.zip');

        return handler.zipResources(authToken, urls, archiver, res);
      });
  },

  activities(req, res, archiver) {
    let authToken = req.headers.authorization;

    return OV.getActivityUrls(authToken, config.OR_API_URL, req.params.id)
      .then((result) => {
        let activity = result.activity;
        let urls = result.urls;

        res.status(200).attachment(activity.attributes.name + '.zip');

        return handler.zipResources(authToken, urls, archiver, res);
      })
  }
};

module.exports = handler;