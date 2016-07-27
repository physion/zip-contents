var http = require('http');
var stream = require('stream');

var getResource = function(api_url, token, resource_id) {
  return {}; //TODO Promise
}

var getResourceStream = function(api_url, token, resource_id) {
  let url = getResource(api_url, token, resource_id)['url'];
  let result = stream.Readable();
  var request = http.get(url, function(response) {
    response.pipe(result);
  });

  return result;
}

module.exports = {
  getResource: getResource,
  getResourceStream: getResourceStream
}