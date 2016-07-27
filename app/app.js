var express = require('express');
var helmet = require('helmet');

// Constants
const PORT = 8080;


var app = express();
app.use(helmet());

app.post('/api/v1/stream', function(req, res) {

  res.send('BODY has map path=>Revision')
});

app.listen(PORT, function () {
  console.log('zip-contents listening on port ' + PORT);
});