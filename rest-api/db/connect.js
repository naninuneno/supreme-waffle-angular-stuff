const pg = require('pg');
const db_config = require('../app_config/config').config.db;

const client = new pg.Client(db_config);

client.connect();

const pool = new pg.Pool(db_config);
pool.on('error', function(err) {
  console.log('Idle client error', err.message, err.stack);
});

function query(text, params, cb) {
  return pool.query(text, params, cb);
}

function getUserById(id, cb) {
  query('SELECT id, username, type FROM users WHERE id = $1', [parseInt(id, 10)], (err, results) => {
    if(err) {
      console.log('Error when querying user', err);
      return cb(err);
    }

    cb(null, results.rows[0]);
  });
}

module.exports = {
  query: query,
  getUserById: getUserById
};
