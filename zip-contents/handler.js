
/*
Handlers for API requests
*/

// A generator function for iterating the entries of an object
function* entries(obj) {
   for (let key of Object.keys(obj)) {
     yield [key, obj[key]];
   }
}

// Handle stream request
exports.stream = function(req, res) {
  req.body
  for(let [path,revision] of entries(req.body)) {
    //add to zip
  }
  res.status(201).send('BODY has map path=>Revision')
}