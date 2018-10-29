const session = require('express-session');
const pgConnect = require('connect-pg-simple')(session);
const pgPromise = require('pg-promise');
const bluebird = require('bluebird');
const app_config = require('../app_config/config').config;

const pgStoreConfig = {
  pgPromise: pgPromise({promiseLib: bluebird})(app_config.db)
};

const sessionConfig = session({
  maxAge: new Date(Date.now() + 3600000),
  secret: app_config.secret,
  store: new pgConnect(pgStoreConfig),
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

module.exports = {
  sessionConfig: sessionConfig
};
