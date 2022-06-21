const Repository = require('./Repository')

class AuthRepository extends Repository {
  constructor (config) {
    super(config)
  }

  async addCred ({ hash, accessToken, refreshToken, refreshExpiredTime, accessExpiredTime }) {
    const newAuthClient = await this.query(`INSERT INTO auth_client (hash) VALUES ('${hash}') RETURNING id;`)
    const authId = newAuthClient.rows[0].id
    const newTokens = await this.query(`INSERT INTO tokens (auth_client_id, access_token, refresh_token, refresh_expired_time, access_expired_time) 
                     VALUES (${authId}, '${accessToken}', '${refreshToken}', ${refreshExpiredTime}, ${accessExpiredTime}) RETURNING id;`)

    return { authId, accessToken, refreshToken }
  }

  async getCred ({ authId }) {
    const authCred = await this.query(`SELECT * FROM auth_client WHERE id='${authId}'`)

    return authCred.rows[0]
  }

  async addToken ({ authId, accessToken, refreshToken, refreshExpiredTime, accessExpiredTime }) {
    const newTokens = await this.query(`INSERT INTO tokens (auth_client_id, access_token, refresh_token, refresh_expired_time, access_expired_time)
                     VALUES (${authId}, '${accessToken}', '${refreshToken}', ${refreshExpiredTime}, ${accessExpiredTime}) RETURNING id;`)
    return true
  }

  async resetToken ({ authId, accessToken }) {
    const reset = await this.query(`DELETE FROM  tokens WHERE auth_client_id = ${authId} AND  access_token = '${accessToken}';`)
    return true
  }

}

module.exports = AuthRepository
