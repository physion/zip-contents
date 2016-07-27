var express = require('express');
var router = express.Router();
var handler = require('../handler');

var archiver = require('archiver');

/* GET listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/api/v1/resources', function(req, res, next) {
  let api_url = process.env.API_URL || '';
  handler.resources(req, res, api_url, archiver);
});

module.exports = router;
