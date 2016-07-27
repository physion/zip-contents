var http = require('http');
var stream = require('stream');
var RSVP = require('rsvp');


var getResource = function(api_url, token, resource_id) {
  console.log('getResource');
  let result = new RSVP.Promise((resolve, reject) => {
    opts = {
      protocol: 'https',
      host: api_url,
      path: '/api/v1/resources/' + resource_id,
      headers: {
        Authorization: token,
        Accept: 'application/json'
      }
    };

    http.get(opts, (res) => {
      console.log('response');
      resolve(res);
    }).on('error', (e) => {
      console.log('error');
      console.log(e.message);
      reject(e);
    });
  });

  return result;
}

var getResourceStream = function(api_url, token, resource_id) {
  let promise = getResource(api_url, token, resource_id)
    .then(resource => {
      let result = stream.Readable();
      let url = resource['url'];
      var request = http.get(url, function(response) {
        response.pipe(result);
      });

      return result;
    });

  return promise;
}

module.exports = {
  getResource: getResource,
  getResourceStream: getResourceStream
}