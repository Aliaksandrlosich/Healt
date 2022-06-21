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
        DROP TABLE IF EXISTS medication CASCADE ;
        DROP TABLE IF EXISTS users CASCADE ;
        DROP TABLE IF EXISTS auth_client CASCADE ;
        DROP TABLE IF EXISTS tokens CASCADE ;
        
        CREATE TABLE users  (id serial PRIMARY KEY, username VARCHAR(100), auth_client_id serial);
        CREATE TABLE medication  (id serial PRIMARY KEY, user_id serial, name VARCHAR(100), description text,initial_count INTEGER, destination_count INTEGER);
        ALTER TABLE medication ADD CONSTRAINT "FK_user_id" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT;
        CREATE INDEX IF NOT EXISTS "fki_FK_user_id" ON medication(id, user_id);
        
        CREATE TABLE auth_client  (id serial PRIMARY KEY, hash VARCHAR(100));
        ALTER TABLE users ADD CONSTRAINT "FK_auth_id" FOREIGN KEY (auth_client_id) REFERENCES auth_client(id) ON UPDATE CASCADE ON DELETE RESTRICT;
        
        CREATE TABLE tokens (id serial PRIMARY KEY, auth_client_id serial, access_token VARCHAR(200), refresh_token VARCHAR(200), refresh_expired_time bigint, access_expired_time bigint, fingerprint VARCHAR(100));
        ALTER TABLE tokens ADD CONSTRAINT "FK_auth_id" FOREIGN KEY (auth_client_id) REFERENCES auth_client(id) ON UPDATE CASCADE ON DELETE RESTRICT;
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
