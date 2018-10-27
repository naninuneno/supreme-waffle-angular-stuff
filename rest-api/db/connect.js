const pg = require('pg');
const db_config = require('../app_config/config').config.db;

const client = new pg.Client(db_config);

client.connect();

// Testing
client.query('SELECT * FROM public.users', (err, res) => {
  if (err) {
    console.log(err.stack);
  } else {
    console.log('rows: ' + res.rows.length);
    for (let row of res.rows) {
      console.log('row data: ' + JSON.stringify(row));
    }
  }
  client.end();
});

const pool = new pg.Pool(db_config);
pool.on('error', function(err) {
  console.log('Idle client error', err.message, err.stack);
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  }
};
