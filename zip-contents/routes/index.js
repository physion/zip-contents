var express = require('express');
var router = express.Router();

var handler = require('../handler');

/* GET listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/api/v1/stream', function(req, res, next) {
  handler.stream(req, res);
});

module.exports = router;
