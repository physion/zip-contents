var request = require('request');
var stream = require('stream');
var RSVP = require('rsvp');

RSVP.on('error', function(reason) {
  console.assert(false, reason);
});

var getResource = function(token, resource_url) {
  let result = new RSVP.Promise((resolve, reject) => {
    opts = {
      url: resource_url, // + '?token=' + token,
      headers: {
        'Authorization': token,
        'Accept': 'application/json'
      }
    };

    request.get(opts, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body));
      } else {
        reject(error);
      }
    });
  });

  return result;
}

var getResourceStream = function(token, resource_url) {
  let promise = getResource(token, resource_url)
    .then((resource) => {
      let url = resource['url'];
      
      let result = stream.Readable();

      request.get(url).pipe(result);

      return result;
    });

    //TODO handle error in getResource

  return promise;
}

module.exports = {
  getResource: getResource,
  getResourceStream: getResourceStream
}