/*
Handlers for API requests
*/

var OV = require('./ovation');
var RSVP = require('rsvp');
var config = require('./config')


// A generator function for iterating the entries of an object
function* entries(obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}

// Handle stream request

function bearerToken(req) {
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

exports.resources = function(req, res, archiver) {

  let authToken = req.headers.authorization; //bearerToken(req);

  let zip = archiver('zip');

  futureStreams = [];
  for (let [path, resource_url] of entries(req.body)) {
    let p = OV.getResourceStream(authToken, resource_url)
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
      res.status(201).attachment('resources.zip'); //TODO
      zip.pipe(res);
    });
}

exports.resource_groups = function(req, res, archiver) {
  let authToken = req.headers.authorization; //bearerToken(req);

  let zip = archiver('zip');

  futureStreams = [];
  groupName = '';
  return OV.getResourceGroupStreams(authToken, config.SERVICES_API, req.params.id)
    .then((result) => {
      groupName = result.groupName;
      streams = result.streams;
      for (let [path, s] of entries(streams)) {
        zip.append(s, {
          name: path
        });
        futureStreams.push(s);
      }

      return RSVP.all(futureStreams)
        .then((streams) => {
          zip.finalize();
          res.status(201).attachment(groupName + '.zip');
          zip.pipe(res);

          return res;
        });
    });
}