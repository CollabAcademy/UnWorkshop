var express = require('express');
var util = require('util');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var partials = require('express-partials');

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
  STAGE : [
    'not_ready', // show only landing page
    'home', // allow login
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
    not_ready: 'shows only landing page',
    home: 'allows login',
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

// ===== Get everyone on the same page (middleware)

app.use(function same_page(req, res, next) {
  switch (req.originalUrl) {
    case '/':
    case '/admin':
    case '/login':
    case '/logout':
    case '/auth/github':
    case '/auth/github/callback':
    case '/account':
      return next();
    case '/ideas':
    case '/methods':
    case '/milestones':
      return next();
    default:
      return next();
  }
});

function make_url(url){
  return HOST+url
}
// ===== routes

// GET /
app.get('/', function(req, res){
  // res.json({
  //   message: 'I recommend using the plugin below to see a beautified version of this json response',
  //   plugin: {
  //     chrome: 'https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc',
  //     firefox: 'https://addons.mozilla.org/en-us/firefox/addon/jsonview/'
  //   },
  //   todo: 'this is the landing page, describe the project, show links to the login, logout and profile if logged-in, and links to ideas/methods/milestones',
  //   login: make_url('/login'),
  //   account: make_url('/account'),
  //   ideas: make_url('/ideas'),
  //   methods: make_url('/methods'),
  //   milestones: make_url('/milestones')
  // });
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
  function(req, res) {
    res.redirect('/account');
  });

// GET /auth/google/callback
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/account');
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
    res.render('admin');
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
    res.render('ideas');
  });

// POST /ideas
app.post('/ideas',
  ensureAuthenticated,
  function(req, res, next) {
    res.json({
      todo: 'receives the proposed idea, commits it to the ideas directory in the git repository, shows success message'
    })
  });

// POST /ideas/rating
app.post('/ideas/rate',
  ensureAuthenticated,
  function(req, res, next) {
    res.json({
      todo: 'receives the rating for a idea, store it locally before aggreagation'
    })
  });

// GET /ideas/filter
app.get('/ideas/filter',
  ensureAuthenticated,
  function(req, res, next) {
    res.json({
      todo: 'shows all the proposed ideas along with the final rating, allows only the admin to make the choice'
    })
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
    res.json({
      todo: 'describe what a method is? show links to propose a method, list all methods, rate methods and show the filtered methods depending on what stage we are in'
    });
  });

// GET /methods/create
app.get('/methods/create',
  ensureAuthenticated,
  function(req, res, next) {
    res.json({
      todo: 'shows a form to propose a method, fields- proposal, label, discription'
    })
  });

// POST /methods/create
app.post('/methods/create',
  ensureAuthenticated,
  function(req, res, next) {
    res.json({
      todo: 'receives the proposed method, commits it to the methods directory in the git repository, shows success message'
    })
  });

// GET /methods/all
app.get('/methods/all',
  ensureAuthenticated,
  function(req, res, next) {
    res.json({
      todo: 'shows all the proposed methods, allows rating depending on the stage we are in'
    })
  });

// POST /methods/rating
app.post('/methods/rate',
  ensureAuthenticated,
  function(req, res, next) {
    res.json({
      todo: 'receives the rating for a method, store it locally before aggreagation'
    })
  });

// GET /methods/filter
app.get('/methods/filter',
  ensureAuthenticated,
  function(req, res, next) {
    res.json({
      todo: 'shows all the proposed methods along with the final rating, allows only the admin get to make the choices'
    })
  });

// POST /methods/filter
app.post('/methods/filter',
  ensureAuthenticated,
  function(req, res, next) {
    res.json({
      todo: 'receives the filteres methods, add the proposal to the readme'
    })
  });

// GET /milestones
app.get('/milestones',
  ensureAuthenticated,
  function(req, res, next) {
    res.json({
      todo: 'show links to create a milestone, show all milestones, rate milestones and show the filtered milestones'
    });
  });

app.listen((process.env.PORT || 3000));
