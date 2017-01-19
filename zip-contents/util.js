// A generator function for iterating the entries of an object
var exp = {
  entries: function*(obj) {
    for (let key of Object.keys(obj)) {
      yield [key, obj[key]];
    }
  },

  update(o1, o2) {
    for (let [k,v] of exp.entries(o2)) {
      o1[k] = v;
    }

    return o1;
  },

  getRequestToken(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.ovation_id_token) {
      return req.cookies.ovation_id_token;
    }

    return null;
  }
}

module.exports = exp;