const Repository = require('./Repository')

class AuthRepository extends Repository {
  constructor (config) {
    super(config)
  }

  async addNewCred ({ hash, accessToken, refreshToken, refreshExpiredTime, accessExpiredTime }) {
    const newTokens = await this.query(`INSERT INTO tokens (access_token, refresh_token, refresh_expired_time, access_expired_time) 
    VALUES ('${accessToken}', '${refreshToken}', ${refreshExpiredTime}, ${accessExpiredTime}) RETURNING id;`)

    const tokenId = newTokens.rows[0].id
    const newAuthClient = await this.query(`INSERT INTO auth_client (hash, token_id) VALUES ('${hash}', ${tokenId}) RETURNING id;`)

    return { authId: newAuthClient.rows[0].id, accessToken, refreshToken }
  }

  async getCred () {

  }

  async resetCred ({ auth_client_id }) {
    const reset = await this.query(`UPDATE tokens SET access_token=null, refresh_token=null, refresh_expired_time=null, access_expired_time=null
    WHERE id=${auth_client_id};`)
    return true
  }

}

module.exports = AuthRepository
