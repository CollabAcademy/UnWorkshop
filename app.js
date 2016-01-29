var express = require('express');
var util = require('util');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var partials = require('express-partials');
var db = require('./models');

// ===== config files, values need to be updated by the admin
var creds = require('./creds.js');
var admins = require('./admins.js')

// ===== config vars
var GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
var GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
var GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
var GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
var HOST = process.env.HOST;

// ===== login OAuth2 =>https://github.com/cfsghost/passport-github
var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the GitHubStrategy within Passport.
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: HOST+"/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: HOST+"/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}


// ===== github api library => https://github.com/mikedeboer/node-github
var GitHubApi = require("github");
var github = new GitHubApi({
    version: "3.0.0",
    // optional
    debug: true,
    protocol: "https",
    timeout: 5000,
    headers: {
        "user-agent": "MIT-IAP-UnWorkshop-App" // GitHub is happy with a unique user agent
    }
});

// ===== initialize app
var app = express();
app.set('port', (process.env.PORT || 3000));

// ===== configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({
  secret: 'qwerty keyboard',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: 'auto' }
}))
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

// ===== app.locals and req.locals (middleware)
app.locals = {
  admins : admins,
  // db_init : function(){
  //   pg.query('SELECT author FROM books WHERE name = $1', [book])
  // },
  STAGE : [
    'register', // allow login
    'gather_idea', // allow idea submission
    'rate_idea', // allow rating of ideas
    'filter_idea', // allow idea filter only by admin
    'gather_methods', // allow method submission
    'rate_methods', // allow rating of methods
    'filter_methods', // allow methods filter only by admin
    'gather_milestones', // allow milestone submission
    'rate_milestones', // allow rating of milestones
    'filter_milestones', // allow milestones filter only by admin
    'end' // show summary
  ],
  STAGE_DESCRIPTION : {
    register: 'allows login',
    gather_idea: 'allows idea submission',
    rate_idea: 'allows rating of ideas',
    filter_idea: 'allows idea filter only by admin',
    gather_methods: 'allows method submission',
    rate_methods: 'allows rating of methods',
    filter_methods: 'allows methods filter only by admin',
    gather_milestones: 'allows milestone submission',
    rate_milestones: 'allows rating of milestones',
    filter_milestones: 'allows milestones filter only by admin'
  },
  _stage : 0
};

app.use(function res_locals(req, res, next) {
  res.locals = {
    user: req.user,
    is_admin: (req.user) ? (req.app.locals.admins.LIST.indexOf(req.user.emails[0].value) >= 0) : false
  };
  return next();
});

function make_url(url){
  return HOST+url
}
// ===== routes

// GET /
app.get('/', function(req, res){
  res.render('index');
});

// GET /login
app.get('/login', function(req, res){
  if(req.user){res.redirect('/');}
  res.render('login', { user: req.user, admins: admins});
});

// GET /auth/github
app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }),
  function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  });

// GET /auth/google
app.get('/auth/google',
  passport.authenticate('google', { scope: [
    'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read' ] }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

// GET /auth/github/callback
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res, next) {
    var user = req.user;
    if(user){
      db.User.create({ name: user.displayName, email: user.emails[0].value});
      res.redirect('/account');
    }
    else{
      res.redirect('/login');
    }
  });

// GET /auth/google/callback
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res, next) {
    var user = req.user;
    if(user){
      db.User.create({ name: user.displayName, email: user.emails[0].value}).error();
      res.redirect('/account');
    }
    else{
      res.redirect('/login');
    }
  });

// GET /logout
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

// GET /account
app.get('/account',
  ensureAuthenticated,
  function(req, res){
    res.render('account');
  });

// GET /admin
app.get('/admin',
  ensureAuthenticated,
  function(req, res, next){
    if(res.locals.is_admin)
      res.render('admin');
    else
      res.redirect('/');
  });

app.post('/admin/stage',
  ensureAuthenticated,
  function(req, res, next){
    req.app.locals._stage = Number(req.body.stage);
    res.redirect('/admin')
  });

// GET /ideas
app.get('/ideas',
  ensureAuthenticated,
  function(req, res, next) {
    switch (req.app.locals._stage) {
      case 1:
        res.render('ideas_form', {phase : 'idea'});
        break;
      case 2:
        db.Idea.findAll({
          attributes: ['id', 'title', 'blurb', 'success_metric']
        })
        .then(function(idea){
          res.render('ideas_list', {stage: 'rate', idea : idea, phase : 'idea'});
        })
        break;
      case 3:
        db.Idea.findAll({
          attributes: ['id', 'title', 'blurb', 'success_metric',]
        })
        .then(function(idea){
          res.render('ideas_list', {stage: 'select', idea : idea, phase : 'idea'});
        })
        break;
      default:
        res.redirect('/')
    }
  });

// POST /ideas
app.post('/ideas',
  ensureAuthenticated,
  function(req, res, next) {
    db.Idea.create({
      title: req.body.title,
      blurb: req.body.blurb,
      success_metric: req.body.success_metric
    })
    .then(function(idea){
      res.redirect('/ideas')
    });
  });

// POST /ideas/rate
app.post('/ideas/rate',
  ensureAuthenticated,
  function(req, res, next) {
    db.IdeaRating.create({
      idea_id: req.body.idea_id,
      user_id: req.body.user_id,
      rating: req.body.rating
    }).then(res.redirect('/ideas'))
  });

// POST /ideas/filter
app.post('/ideas/filter',
  ensureAuthenticated,
  function(req, res, next) {
    res.json({
      todo: 'receives the filtered idea, creates a readme in the repository using the title and blurb'
    })
  });

// GET /methods
app.get('/methods',
  ensureAuthenticated,
  function(req, res, next) {
    switch (req.app.locals._stage) {
      case 4:
        res.render('methods_form', {phase : 'method'});
        break;
      case 5:
        db.Method.findAll({
          attributes: ['id', 'label', 'tool', 'description']
        })
        .then(function(idea){
          res.render('methods_list', {stage: 'rate', method : method, phase : 'method'});
        })
        break;
      case 6:
        db.Method.findAll({
          attributes: ['id', 'label', 'tool', 'description', 'rating']
        })
        .then(function(idea){
          res.render('methods_list', {stage: 'select', method : method, phase : 'method'});
        })
        break;
      default:
        res.redirect('/')
    }
  });

// POST /methods
app.post('/methods',
  ensureAuthenticated,
  function(req, res, next) {
    db.Method.create({
      label: req.body.label,
      tool: req.body.tool,
      description: req.body.description
    })
    .then(function(method){
      res.redirect('/methods')
    });
  });

// POST /methods/rating
app.post('/methods/rate',
  ensureAuthenticated,
  function(req, res, next) {
    db.MethodRating.create({
      method_id: req.body.method_id,
      user_id: req.body.user_id,
      rating: req.body.rating
    }).then(res.redirect('/methods'))
  });

// POST /methods/filter
app.post('/methods/filter',
  ensureAuthenticated,
  function(req, res, next) {
    res.json({
      todo: 'database'
    })
  });

// GET /milestones
app.get('/milestones',
  ensureAuthenticated,
  function(req, res, next) {
    switch (req.app.locals._stage) {
      case 7:
        res.render('milestones_form', {phase : 'milestone'});
        break;
      case 8:
        db.Milestone.findAll({
          attributes: ['id', 'date', 'milestone', 'description']
        })
        .then(function(milestone){
          res.render('milestones_list', {stage: 'rate', milestone : milestone, phase : 'method'});
        })
        break;
      case 9:
        db.Milestone.findAll({
          attributes: ['id', 'date', 'milestone', 'description', 'rating']
        })
        .then(function(milestone){
          res.render('milestones_list', {stage: 'select', milestone : milestone, phase : 'method'});
        })
        break;
      default:
        res.redirect('/')
    }
  });

// POST /milestones
app.post('/milestones',
  ensureAuthenticated,
  function(req, res, next) {
    db.Milestone.create({
      date: req.body.date,
      milestone: req.body.milestone,
      description: req.body.description
    })
    .then(function(milestone){
      res.redirect('/milestones')
    });
  });


// POST /milestones/rating
app.post('/milestones/rate',
  ensureAuthenticated,
  function(req, res, next) {
    db.MilestoneRating.create({
      milestone_id: req.body.milestone_id,
      user_id: req.body.user_id,
      rating: req.body.rating
    }).then(res.redirect('/milestones'))
  });

// POST /milestones/filter
app.post('/milestones/filter',
  ensureAuthenticated,
  function(req, res, next) {
    res.json({
      todo: 'database'
    })
  });


// app.listen((process.env.PORT || 3000));
db.sequelize.sync().then(function() {
  app.listen( (process.env.PORT || 3000) , function(){
    console.log('Express server listening on port ' + (process.env.PORT || 3000));
  });
});
