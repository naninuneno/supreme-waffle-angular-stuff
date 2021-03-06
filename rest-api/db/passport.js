const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const db = require('./connect');

passport.use(new LocalStrategy((username, password, cb) => {
  db.query('SELECT id, username, password, type FROM users WHERE username=$1', [username], (err, result) => {
    if (err) {
      console.log('Error when selecting user on login', err);
      return cb(err);
    }

    // Authentication
    if (result.rows.length > 0) {
      const first = result.rows[0];

      bcrypt.compare(password, first.password, function (err, res) {
        if (res) {
          cb(null, {id: first.id, username: first.username, type: first.type});
        } else {
          cb(null, false);
        }
      })
    } else {
      cb(null, false);
    }
  });
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, cb) => {
  db.getUserById(id, cb);
});
