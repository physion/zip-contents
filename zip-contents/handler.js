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
exports.resources = function(req, res, api_url, archiver) {

  let authToken = req.get('Authorization');

  let zip = archiver('zip');

  futureStreams = [];
  for (let [path, resource_id] of entries(req.body)) {
    let p = OV.getResourceStream(api_url, authToken, resource_id)
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