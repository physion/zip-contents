/*
Handlers for API requests
*/

var ov = require('./ovation');


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
  
  for (let [path, resource_id] of entries(req.body)) {
    zip.append(ov.getResourceStream(api_url, authToken, resource_id), {name: path});
  }

  zip.finalize();

  res.status(201).attachment('resources.zip'); //TODO

  zip.pipe(res);
}