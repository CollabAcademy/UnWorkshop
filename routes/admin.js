var express = require('express');
var router = express.Router();

var User = require('../models/user').User
var Form = require('../models/form').Form

router.get('/', function(req, res){
  res.render('admin_dash')
});

router.get('/users', function(req, res) {
  User.find({}, function(err, users){
    // res.render('admin_user_list', {users: users})
    res.json(users)
  })
});

router.get('/setup', function(req, res){
  res.render('admin_setup')
});

router.post('/setup/stages', function(req, res){
  var stages = [req.body.stage_one, req.body.stage_two, req.body.stage_three]
  req.app.locals.stages = stages
  res.redirect('/admin/setup')
})

router.post('/setup/rating', function(req, res){
  req.app.locals.rate_at_a_time = req.body.count
  res.redirect('/admin/setup')
})

router.post('/setup/forms',function(req, res){
  var form = {stage: req.body.stage, schema: JSON.parse(req.body.schema)}
  Form.update(
    {stage: form.stage},
    form,
    { upsert: true },
    function(err, num){
      if(err){ res.json(err); }
      else{ res.redirect('/admin/setup') }
    })
})

router.get('/setup/reset', function(req, res){
  Form.remove({}, function(err){
    req.app.locals.stages = ['Stage 1', 'Stage 2', 'Stage 3']
    req.app.locals.steps = ['Submit', 'Rate', 'Filter']
    req.app.locals._stage = 0
    req.app.locals._step = 0
    res.redirect('/admin/setup')
  })
})

router.get('/stage', function(req, res) {
  res.render('admin_stage')
})

router.post('/stage', function(req, res) {
  console.log(typeof req.body.stage);
  app.locals._stage = Number(req.body.stage)
  res.render('admin_stage')
})
module.exports = router;
