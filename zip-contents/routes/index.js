var express = require('express');
var router = express.Router();
var archiver = require('archiver');

var handler = require('../handler');

router.get('/health', (req,res,next) => {
  res.status(200).send('zip-contents is alive');
});

router.post('/api/v1/resources', function(req, res, next) {
  handler.resources(req, res, archiver);
});

module.exports = router;
