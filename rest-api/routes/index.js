const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../db/connect');
const bcrypt = require('bcrypt');

const loginFromRequest = (req, res) => {
  const {user} = req;
  res.json(user);
};

router.get('/', function (req, res) {
  require('../db/connect');
  res.render('index');
});

router.post('/api/login', passport.authenticate('local'), loginFromRequest);

router.post('/api/users/create', function (req, res) {
  const user = req.body;

  if (!user.username) {
    return res.status(422).json({error: "Username required"});
  }
  if (!user.password) {
    return res.status(422).json({error: "Password required"});
  }

  const username = user.username;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      console.log(err.stack);
      return res.status(422).json({error: "Unexpected error occurred"});
    }
    db.query('INSERT INTO users(username, password) VALUES($1, $2) RETURNING *', [username, hash], (err, result) => {
      if (err) {
        console.log(err.stack);
        return res.status(422).json({error: "Unexpected error occurred"});
      } else {
        console.log('User created successfully');
        return res.json(result.rows[0]);
      }
    });
  });
});

module.exports = router;
