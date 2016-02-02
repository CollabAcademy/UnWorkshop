var express = require('express');
var router = express.Router();

var User = require('../models/user').User
var Form = require('../models/form').Form

router.get('/', function(req, res){
  Form.remove({});
  var formForm = new Form(
    {
      stage : -1,
      form_name: 'form',
      title: 'Form Schema',
      description: 'Describe your form schema here',
      form_schema: {
        stage: {
          type: 'number',
          title: 'Stage',
          required: true
        },
        form_name: {
          type: 'string',
          title: 'Name your form',
          required: true
        },
        title: {
          type: 'string',
          title: 'Give it a title',
           required: true
        },
        description: {
          type: 'string',
          title: 'Tell something about it, so users know what it is for',
          required: true
        },
        form_schema: {
          type: 'object',
          title: 'define the json schema of the form',
          required: true
        }
      }
    }
  )
  var ideaForm = new Form(
    {
      stage : 1,
      form_name: 'ideas',
      title: 'What\'s your idea?',
      description: 'Please fill in the following ascpects of your idea',
      form_schema: {
        title: {
          type: 'string',
          title: 'Title',
          required: true
        },
        blurb: {
          type: 'string',
          title: 'A short summary',
          required: true
        },
        success_metrics: {
          type: 'array',
          title: 'Success Metrics',
          required: true
        }
      }
    }
  )
  var methodForm = new Form(
    {
      stage : 2,
      form_name: 'methods',
      title: 'How do you suggest we do it?',
      description: 'describe the tools and methodologies the you recommend using',
      form_schema: {
        label: {
          type: 'string',
          title: 'Label',
          required: true,
          enum: ['language', 'framework', 'tool', 'methodology']
        },
        title: {
          type: 'string',
          title: 'Title',
          required: true
        },
        description: {
          type: 'string',
          title: 'Please describe',
          required: true
        }
      }
    }
  )
  var milestone = new Form(
    {
      stage : 3,
      form_name: 'Milestones',
      title: 'Suggest milestone',
      description: 'Please suggest feasable milestones',
      form_schema: {
        title: {
          type: 'string',
          title: 'Title',
          required: true
        },
        date: {
          type: 'date',
          title: 'Expected Date',
          required: true
        },
        description: {
          type: 'string',
          title: 'More details about the milestone',
          required: true
        }
      }
    }
  )
  res.render('admin_dash')
});

router.get('/users', function(req, res) {
  User.find({}, function(err, users){
    // res.render('admin_user_list', {users: users})
    res.json(users)
  })
});

router.get('/build', function(req, res) {
  Form.find(
    { stage: { $gt: 0 } },
    function(err, success){
      if(err) {res.json(err)}
      else { res.render('form_build', {forms: success})}
    }
  )
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
