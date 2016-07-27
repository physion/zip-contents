
/*
Handlers for API requests
*/

var archiver = require('archiver');

// A generator function for iterating the entries of an object
function* entries(obj) {
   for (let key of Object.keys(obj)) {
     yield [key, obj[key]];
   }
}

// Handle stream request
exports.stream = function(req, res) {

  let archive = archiver('zip');  
  for(let [path,revision] of entries(req.body)) {
    //add to zip
  }
  archive.finalize();

  res.status(201)
    .attachment('contents.zip');
  
  archive.pipe(res);
}