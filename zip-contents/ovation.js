var request = require('request');
var stream = require('stream');
var RSVP = require('rsvp');
var config = require('./config');
var util = require('./util')

var exp = {
  getServiceApiOpts(token, url) {
    let opts = {
      url: url,
      headers: {
        'Authorization': token,
        'Accept': 'application/json'
      }
    };

    // console.log(opts);
    return opts;
  },

  getSerivceApi(opts) {
    return new RSVP.Promise((resolve, reject) => {

      request.get(opts, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          resolve(JSON.parse(body));
        } else {
          reject(error);
        }
      });
    });
  },

  getResource(token, resource_url) {
    let opts = exp.getServiceApiOpts(token, resource_url);
    return exp.getSerivceApi(opts);
  },

  getResourceStream(token, resource_url) {
    return exp.getResource(token, resource_url)
      .then((resource) => {
        let url = resource['url'];

        return request.get(url);
      });

    //TODO handle error in getResource
  },

  getResourceGroup(token, api_url, id) {
    let groupUrl = api_url + '/api/v1/resource_groups/' + id;
    let opts = exp.getServiceApiOpts(token, groupUrl);

    return exp.getSerivceApi(opts);
  },

  getResourceGroupUrls(token, api_url, id) {
    let urls = {}
    let groupName = null;

    return exp.getResourceGroup(token, api_url, id)
      .then((response) => {
        groupName = response.resource_group.name;

        for (resource of response.resources) {
          urls[groupName + "/" + resource.name] = resource.url;
        }

        let children = response.resource_group.resource_groups;
        if (!children || children.length === 0) {
          return {
            groupName: groupName,
            urls: urls
          };
        } else {

          //recurse
          let childUrlFutures = children.map((g) => {
            return exp.getResourceGroupUrls(token, api_url, g);
          });

          return RSVP.all(childUrlFutures).then((childUrls) => {
            for (cs of childUrls) {
              for (let [path, url] of util.entries(cs.urls)) {
                urls[path] = url;
              }
            }

            return {
              groupName: groupName,
              streams: urls
            }
          });
        }
      });
  }

}

module.exports = exp;