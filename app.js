var express = require('express');
var util = require('util');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var partials = require('express-partials');

// ===== config files, values need to be updated by the admin
var creds = require('./creds.js');
var admins = require('./admins.js')

// ===== Githib dev config
var GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
var GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// ===== login using Github OAuth2 =>https://github.com/cfsghost/passport-github
var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;

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
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
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
app.set('port', (process.env.PORT || 5000));

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

// ===== Get everyone on the same page
var STAGE = {
  not_ready: 0,
  prepare: 1, //show only landing page
  start: 2, //allow login, show user details from github maybe?

  gather_ideas: 3, //show form, allow only idea submission
  rate_ideas: 4, //show all ideas collected, allow rating
  choose_idea: 5, //show ideas in a sorted manner, only admin can choose

  gather_methods: 6, //show form, allow only process submission
  rate_methods: 7, //show all ideas collected, allow rating
  choose_methods: 8, //show process in a sorted manner, only admin can choose

  gather_milestones: 9, //show form, allow only milestone submission
  choose_milestones: 10, //show all proposed milestones, only admins and choose

  finish: 11 //make the summary available to all
}

var _stage = STAGE.not_ready;

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

// ===== routes

// GET /
app.get('/', function(req, res){
  res.json({
    message: 'I recommend using the plugin below to see a beautified version of this json response',
    plugin: {
      chrome: 'https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc',
      firefox: 'https://addons.mozilla.org/en-us/firefox/addon/jsonview/'
    },
    todo: 'this is the landing page, describe the project, show links to the login, logout and profile if logged-in, and links to ideas/methods/milestones',
    login: 'http://localhost:3000/login',
    account: 'http://localhost:3000/account',
    ideas: 'http://localhost:3000/ideas',
    methods: 'http://localhost:3000/methods',
    milestones: 'http://localhost:3000/milestones'
  });
});

// GET /login
app.get('/login', function(req, res){
  res.render('login', { user: req.user, admins: admins});
});

// GET /auth/github
app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }),
  function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  });

// GET /auth/github/callback
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
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
    res.render('account', { user: req.user, admins: admins });
  });

// GET /admin
app.get('/admin',
  ensureAuthenticated,
  function(req, res, next){
    res.json({message: 'todo'})
  });

// GET /ideas
app.get('/ideas',
  function(req, res, next) {
    res.json({
      todo: 'describe the scenario/context? show links to create an idea, list all ideas, rate ideas and show the choosen idea depending on what stage we are in'
    });
  });

// GET /ideas/create
app.get('/ideas/create',
  ensureAuthenticated,
  function(req, res, next) {
    res.json({
      todo: 'show a form to create an idea'
    })
  });

// POST /ideas/create
app.post('/ideas/create',
  ensureAuthenticated,
  function(req, res, next) {
    res.json({
      todo: 'receives the proposed idea, commits it to the ideas directory in the git repository, shows success message'
    })
  });

// GET /ideas/all
app.get('/ideas/all',
  ensureAuthenticated,
  function(req, res, next) {
    res.json({
      todo: 'shows all the proposed ideas, allows rating depending on the stage we are in'
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
  // ensureAuthenticated,
  function(req, res, next) {
    res.json({
      todo: 'show links to create a milestone, show all milestones, rate milestones and show the filtered milestones'
    });
  });

app.listen(3000);
