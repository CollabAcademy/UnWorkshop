var express = require('express');
var router = express.Router();
var Method = require('../models/method').Method;
var stringify = require('json-stringify-safe');

router.get('/', function(req, res) {
  Method.find({}, function(err, methods){
    if(err) {res.json(err)}
    else { res.render('methods', methods) }
  })
});

router.get('/gather',
  function(req, res, next){
    if(app.locals._stage == 4)
      return next()
    else
      res.redirect('/')
  },
  function(req, res) {
    res.render('methods_gather')
});

router.post('/gather', function(req, res) {
  method = {
    label: req.body.label,
    tool: req.body.tool,
    description: req.body.description,
    user_email: res.locals.user_email
  }

  Method.create(method, function(err, method){
    if(method)
      res.json(method);
    else
      res.json(err)
  })
});

router.get('/rate',
  function(req, res, next){
    if(app.locals._stage == 5)
      return next()
    else
      res.redirect('/')
  },
  function(req, res) {
    Method.find({}, function (err, methods) {
      if(methods)
        res.render('methods_rate', {methods: methods})
      else
        res.json(error)
    })
});

router.post('/rate', function(req, res) {
  Method.find({_id : req.body._id}, function(err, method){
    if(method){
      method[0].rate(req.body.rating, function(err, x){
        res.json(x)
      })
    }
  })
});

router.get('/filter',
  function(req, res, next){
    if(app.locals._stage == 6)
      return next()
    else
      res.redirect('/')
  },
  function(req, res) {
    Method.find().sort({rating: -1}).exec(function(err, methods){
      res.render('methods_filter', {methods: methods})
    });
});

router.post('/filter', function(req, res) {
  Method.find({_id : req.body._id}, function(err, method){
    if(method){
      method[0].select(function(err, x){
        res.json(x)
      })
    }
  })
});

router.get('/result',
  function(req, res, next){
    if(app.locals._stage > 6)
      return next()
    else
      res.redirect('/')
  },
  function(req, res) {
  Method.find({selected: true}, function(err, methods){
    res.json(methods)
  });
});

module.exports = router;
