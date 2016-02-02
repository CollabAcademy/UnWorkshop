var express = require('express');
var router = express.Router();
var User = require('../models/user').User;

router.get('/', function(req, res) {
  User.findOne(
    { email: req.user.emails[0].value },
    function(err, user){
      if(user) { res.json(user)}
      else {res.json(err)}
    }
  )
});

module.exports = router;
