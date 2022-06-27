const Repository = require('./Repository')

class UserRepository extends Repository {
 constructor (config) {
  super(config)
 }

 async getUser ({ key, value }) {
  const user = await this.query(`SELECT * FROM users WHERE ${key} = '${value}';`)

  return user.rows?.[0]
 }

 async addNewUser ({ username, authId }) {
  const newUser = await this.query(`INSERT INTO users (username, auth_client_id) VALUES ('${username}', ${authId}) RETURNING id;`)
  return { userId: newUser.rows[0].id }
 }

 checkUserName () {

 }

}

module.exports = UserRepository
