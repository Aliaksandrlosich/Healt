const pg = require('pg');
const config = require('./config/config.json')


const client = new pg.Client(config.database);

client.connect(err => {
  if (err) throw err;
  else {
    queryDatabase();
  }
});

function queryDatabase() {
  const query = `
        DROP TABLE IF EXISTS medication;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS auth;
        CREATE TABLE users  (id serial PRIMARY KEY, username VARCHAR(50), auth_id serial);
        CREATE TABLE medication  (id serial PRIMARY KEY, user_id serial, name VARCHAR(50), description text,initial_count INTEGER, destination_count INTEGER);
        ALTER TABLE medication ADD CONSTRAINT "FK_user_id" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT;
        CREATE INDEX IF NOT EXISTS "fki_FK_user_id" ON medication(id, user_id);
        CREATE TABLE auth  (id serial PRIMARY KEY, token VARCHAR(50), expired_time timestamp);
        ALTER TABLE users ADD CONSTRAINT "FK_auth_id" FOREIGN KEY (auth_id) REFERENCES auth(id) ON UPDATE CASCADE ON DELETE RESTRICT;
    `;

  client
  .query(query)
  .then(() => {
    console.log('Table created successfully!');
    client.end(console.log('Closed client connection'));
  })
  .catch(err => console.log(err))
  .then(() => {
    console.log('Finished execution, exiting now');
    process.exit();
  });
}
