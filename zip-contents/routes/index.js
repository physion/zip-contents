var express = require('express');
var router = express.Router();
var archiver = require('archiver');

var handler = require('../handler');

router.get('/', (req,res,next) => {
  res.status(200)
    .contentType('application/json')
    .send({status: 'alive'});
});

router.post('/api/v1/resources', (req, res, next) => {
  handler.resources(req, res, archiver);
});

router.get('/api/v1/resource_groups/:id', (req, res, next) => {
  handler.resource_groups(req, res, archiver);
});

router.get('/api/v1/activities/:id', (req, res, next) => {
  handler.activities(req, res, archiver);
});

module.exports = router;
