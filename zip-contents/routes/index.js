var express = require('express');
var router = express.Router();
var archiver = require('archiver');

var handler = require('../handler');

router.post('/api/v1/resources', function(req, res, next) {
  handler.resources(req, res, archiver);
});

module.exports = router;
