var request = require('request');
var stream = require('stream');
var RSVP = require('rsvp');

RSVP.on('error', function(reason) {
  console.assert(false, reason);
});

var getResource = function(api_url, token, resource_id) {
  let result = new RSVP.Promise((resolve, reject) => {
    opts = {
      url: api_url + '/api/v1/resources/' + resource_id,
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

var getResourceStream = function(api_url, token, resource_id) {
  let promise = getResource(api_url, token, resource_id)
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