const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../db/connect');
const bcrypt = require('bcrypt');

router.get('/api/users', authenticationGuard, (req, res, next) => {
  db.query('SELECT id, username, password FROM users', [], (err, result) => {
    if (err) {
      console.log(err.stack);
      return res.status(422).json({error: "Unexpected error occurred"});
    } else {
      return res.json(result.rows);
  }
  });
});

router.get('/api/currentuser', authenticationGuard, (req, res, next) => {
  getCurrentUser(req, function(user) { res.json(user); });
});

router.get('/api/is_authenticated', (req, res, next) => {
  res.json(isAuthenticated(req));
});

router.post('/api/login', (req, res, next) => {
  const user = req.body;

  if (!user.username) {
    return res.status(422).json({error: "Username required"});
  }
  if (!user.password) {
    return res.status(422).json({error: "Password required"});
  }

  return passport.authenticate('local', {session: false}, (err, passportUser, info) => {
    if (err) {
      return res.status(422).json({error: err.message});
    }

    if (passportUser) {
      return req.logIn(passportUser, function(err) {
        if (err) {
          return res.status(422).json({error: err.message});
        }

        return res.json({
          user: passportUser,
          session: req.session,
          session_id: req.sessionID
        });
      });
    }

    return res.status(422).json({error: 'Invalid credentials'});
  })(req, res, next);
});

router.post('/api/logout', (req, res, next) => {
  if (isAuthenticated(req)) {
    console.log('Logging out');
    req.logout();
    req.session.destroy();
    return res.json({info: 'Logged out'});
  } else {
    console.log('Can\'t log out');
    return res.json({info: 'Not logged in'});
  }
});

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

function isAuthenticated(req) {
  console.log(req.session);
  return !!(req.session.passport && req.session.passport.user);
}

function authenticationGuard(req, res, next) {
  if (!isAuthenticated(req)) {
    return res.status(422).json({error: 'Unauthorized'});
  }
  return next();
}

function getCurrentUser(req, cb) {
  const userId = req.session.passport.user;
  return db.getUserById(userId, function(err, user) {
    return cb(user);
  });
}

module.exports = router;
