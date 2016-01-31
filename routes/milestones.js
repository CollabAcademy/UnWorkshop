var express = require('express');
var router = express.Router();
var Milestone = require('../models/milestone').Milestone;
var Method = require('../models/method').Method;
var Idea = require('../models/idea').Idea;
var stringify = require('json-stringify-safe');

router.get('/', function(req, res) {
  Milestone.find({}, function(err, milestones){
    if(err) {res.json(err)}
    else { res.render('milestones', milestones) }
  })
});

router.get('/gather',
  function(req, res, next){
    if(app.locals._stage == 7)
      return next()
    else
      res.redirect('/')
  },
  function(req, res) {
    res.render('milestones_gather')
});

router.post('/gather', function(req, res) {
  milestone = {
    title: req.body.title,
    date: req.body.date,
    description: req.body.description,
    user_email: res.locals.user_email
  }

  Milestone.create(milestone, function(err, milestone){
    if(milestone)
      res.json(milestone);
    else
      res.json(err)
  })
});

router.get('/rate',
  function(req, res, next){
    if(app.locals._stage == 8)
      return next()
    else
      res.redirect('/')
  },
  function(req, res) {
    Milestone.find({}, function (err, milestones) {
      if(milestones)
        res.render('milestones_rate', {milestones: milestones})
      else
        res.json(error)
    })
});

router.post('/rate', function(req, res) {
  Milestone.find({_id : req.body._id}, function(err, milestone){
    if(milestone){
      milestone[0].rate(req.body.rating, function(err, x){
        res.json(x)
      })
    }
  })
});

router.get('/filter', function(req, res) {
  Milestone.find().sort({rating: -1}).exec(function(err, milestones){
    res.render('milestones_filter', {milestones: milestones})
  });
});

router.post('/filter',
  function(req, res, next){
    if(app.locals._stage == 9)
      return next()
    else
      res.redirect('/')
  },
  function(req, res) {
    Milestone.find({_id : req.body._id}, function(err, milestone){
      if(milestone){
        milestone[0].select(function(err, x){
          res.json(x)
        })
      }
    })
});

router.get('/result',
  function(req, res, next){
    if(app.locals._stage > 9)
      return next()
    else
      res.redirect('/')
  },
  function(req, res) {
  Milestone.find({selected: true}, function(err, milestones){
    res.json(milestones)
  });
});


module.exports = router;
