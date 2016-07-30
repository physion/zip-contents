var request = require('request');
var stream = require('stream');
var RSVP = require('rsvp');
var config = require('./config');

var getServiceApiOpts = (token, url) => {
  let opts = {
    url: url,
    headers: {
      'Authorization': token,
      'Accept': 'application/json'
    }
  };

  // console.log(opts);
  return opts;
}

var getSerivceApi = (opts) => {
  return new RSVP.Promise((resolve, reject) => {

    request.get(opts, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body));
      } else {
        reject(error);
      }
    });
  });
}

var getResource = function(token, resource_url) {
  let opts = getServiceApiOpts(token, resource_url);
  return getSerivceApi(opts);
}

var getResourceStream = function(token, resource_url) {
  return getResource(token, resource_url)
    .then((resource) => {
      let url = resource['url'];

      return request.get(url);
    });

  //TODO handle error in getResource
}

var getResourceGroup = function(token, api_url, id) {
  let groupUrl = api_url + '/api/v1/resource_groups/' + id;
  let opts = getServiceApiOpts(token, groupUrl);

  return getSerivceApi(opts);
}

var getResourceGroupStreams = function(token, api_url, id) {
  let streams = {};
  let groupName = null;

  return getResourceGroup(token, api_url, id)
    .then((response) => {
      groupName = response.resource_group.name;

      for (resource of response.resources) {
        streams[groupName + "/" + resource.name] = getResourceStream(token, resource.url);
      }


      return RSVP.hash(streams)
        .then((realStreams) => {
          return {
            groupName: groupName,
            streams: realStreams
          }
        });
    });
}

module.exports = {
  getResource: getResource,
  getResourceStream: getResourceStream,
  getResourceGroup: getResourceGroup,
  getResourceGroupStreams: getResourceGroupStreams
}