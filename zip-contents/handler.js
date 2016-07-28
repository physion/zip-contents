/*
Handlers for API requests
*/

var OV = require('./ovation');
var RSVP = require('rsvp');


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

  let authToken = bearerToken(req);

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