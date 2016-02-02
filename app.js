var express = require('express');
var cookieParser = require('cookie-parser')
var session = require('express-session');
module.exports = app = express();
var bodyParser = require('body-parser');
var passport = require('./passport');
app.locals = {
  stages : require('./stages'),
  _stage : 0
}

// ===== config files, values need to be updated by the admin
var admins = require('./admins.js')

// Database and models
var mongoose = require('mongoose');
var db = mongoose.connect('localhost', 'unworkshop');
var User = require("./models/user").User;
var Form = require("./models/form").Form;

// configure Express
app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
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

// set res.locals
app.use(function (req, res, next) {
  res.locals = {
    user: req.user,
    isAdmin: (req.user) ? (admins.LIST.indexOf(req.user.emails[0].value) >= 0) : false,
    user_email: (req.user) ? (req.user.emails[0].value) : 0
  }
  return next();
});
// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

function ensureAuthenticatedAsAdmin(req, res, next) {
  if (req.isAuthenticated() && res.locals.isAdmin){ return next(); }
  res.redirect('/')
}

//Routes
var routes = require('./routes');
var users = require('./routes/users');
var admin = require('./routes/admin');
var ideas = require('./routes/ideas');
var methods = require('./routes/methods');
var milestones = require('./routes/milestones');

app.use('/', routes);
app.use(ensureAuthenticated);

app.use('/admin', ensureAuthenticatedAsAdmin, admin)

app.use('/user', users)

app.use('/ideas', function(req, res, next){
  if(app.locals._stage >= 1 && app.locals._stage <= 4)
    return next()
  else
    res.redirect('/')
}, ideas)

app.use('/methods', function(req, res, next){
  if(app.locals._stage >= 4 && app.locals._stage <= 7)
    return next()
  else
    res.redirect('/')
}, methods)

app.use('/milestones', function(req, res, next){
  if(app.locals._stage >= 7 && app.locals._stage <= 10)
    return next()
  else
    res.redirect('/')
}, milestones)

// Run the app
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
