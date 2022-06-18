const Repository = require('./Repository')

class UserRepository extends Repository {
  constructor (config) {
    super(config);
  }

  async getUser({username, id}) {
    const foundColumn = username ? 'username' : 'id'
    const value = username || id
    return await this.query(`SELECT * FROM users WHERE ${foundColumn} = '${value}'`)
  }

  async addNewUser({username, authId}) {
    return await this.query(`INSERT INTO users (username, auth_client_id) VALUES ('${username}', ${authId});`)
  }

  checkUserName() {

  }

}

module.exports = UserRepository
