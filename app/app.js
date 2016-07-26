var express = require('express');
var helmet = require('helmet');

// Constants
const PORT = 8080;


var app = express();
app.use(helmet());

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(PORT, function () {
  console.log('zip-contents listening on port ' + PORT);
});