const session = require('express-session');

const sessionConfig = session({
  maxAge: new Date(Date.now() + 3600000),
  store: new MongoStore(db.config.db),
  saveUninitialized: true,
  resave: false,
  // for obfuscation purposes
  name: "id",
  cookie: {
    // only the agent (e.g. browser) will have access for resubmission on requests
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
});

function setupSession() {
  // convenience method to associate user info with a user session
  session.Session.prototype.login = function(user, cb) {
    const req = this.req;
    req.session.regenerate(function(err){
      if (err){
        cb(err);
      }
    });

    req.session.userInfo = user;
    cb();
  };

  session.Session.prototype.logout = function() {
    this.req.session.userInfo = null;
  };

  session.Session.prototype.isLoggedIn = function() {
    return !(this.req.session.userInfo == null);
  };

  session.Session.prototype.currentUser = function() {
    return this.req.session.userInfo.email;
  };
}

module.exports = {
  sessionConfig: sessionConfig,
  setupSession: setupSession
}
