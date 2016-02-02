var express = require('express');
var router = express.Router();
var Idea = require('../models/idea').Idea;
var Form = require('../models/form').Form;
var stringify = require('json-stringify-safe');

router.get('/', function(req, res) {
  Idea.find({}, function(err, ideas){
    if(err) {res.json(err)}
    else { res.render('ideas', ideas) }
  })
});

router.get('/gather',
  function(req, res, next){
    if(app.locals._stage == 1)
      return next()
    else
      res.redirect('/')
  },
  function(req, res) {
    res.render('ideas_gather')
  });

router.post('/gather',
  function(req, res, next){
    if(app.locals._stage == 1)
      return next()
    else
      res.redirect('/')
  },
  function(req, res) {
    idea = {
      title: req.body.title,
      blurb: req.body.blurb,
      success_metrics: req.body.success_metrics,
      user_email: res.locals.user_email
    }

    Idea.create(idea, function(err, idea){
      if(idea)
        res.json(idea);
      else
        res.json(err)
    })
  });

router.get('/rate',
  function(req, res, next){
    if(app.locals._stage == 2)
      return next()
    else
      res.redirect('/')
  },
  function(req, res) {
  Idea.find({}, function (err, ideas) {
    if(ideas)
      res.render('ideas_rate', {ideas: ideas})
    else
      res.json(error)
  })
});

router.post('/rate',
  function(req, res, next){
    if(app.locals._stage == 2)
      return next()
    else
      res.redirect('/')
  },
  function(req, res) {
    Idea.find({_id : req.body._id}, function(err, idea){
      if(idea){
        idea[0].rate(req.body.rating, function(err, x){
          res.json(x)
        })
      }
    })
  });

router.get('/filter',
  function(req, res, next){
    if(app.locals._stage == 3)
      return next()
    else
      res.redirect('/')
  },
  function(req, res) {
  Idea.find().sort({rating: -1}).exec(function(err, ideas){
    res.render('ideas_filter', {ideas: ideas})
  });
});

router.post('/filter',
  function(req, res, next){
    if(app.locals._stage == 3)
      return next()
    else
      res.redirect('/')
  },
  function(req, res) {
    Idea.find({_id : req.body._id}, function(err, idea){
      if(idea){
        idea[0].select(function(err, x){
          res.json(x)
        })
      }
    })
  });

router.get('/result',
  function(req, res, next){
    if(app.locals._stage > 3)
      return next()
    else
      res.redirect('/')
  },
  function(req, res) {
  Idea.find({selected: true}, function(err, ideas){
    res.json(ideas)
  });
});

module.exports = router;
