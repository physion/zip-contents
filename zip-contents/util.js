// A generator function for iterating the entries of an object
function* entries(obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}

module.exports.entries = entries;