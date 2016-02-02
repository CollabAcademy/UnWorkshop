var express = require('express');
var router = express.Router();
var passport = require('../passport');
var User = require('../models/user').User;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// GET /login
router.get('/login', function(req, res){
  if(req.user){res.redirect('/');}
  res.render('login', { user: req.user });
});

// GET /auth/github
router.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }),
  function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  });

// GET /auth/google
router.get('/auth/google',
  passport.authenticate('google', { scope: [
    'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read' ] }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

// GET /auth/github/callback
router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res, next) {
    var user = req.user;
    if(user){
      u = {name: user.username, email: user.emails[0].value}
      User.update(
        {email: u.email},
        u,
        { upsert: true },
        function(err, num){
          if(err){ res.json(err); }
          else{ res.redirect('/') }
        }
      );
    }
    else{
      res.redirect('/login');
    }
  });

// GET /auth/google/callback
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res, next) {
    var user = req.user;
    if(user){
      u = {name: user.username, email: user.emails[0].value}
      User.update(
        {email: u.email},
        u,
        { upsert: true },
        function(err, num){
          if(err){ res.json(err); }
          else{ res.redirect('/') }
        }
      );

    }
    else{
      res.redirect('/login');
    }
  });

// GET /logout
router.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

module.exports = router;
