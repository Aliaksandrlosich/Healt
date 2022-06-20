const Repository = require('./Repository')

class AuthRepository extends Repository {
  constructor (config) {
    super(config)
  }

  async addNewCred ({ hash, accessToken, refreshToken, refreshExpiredTime, accessExpiredTime }) {
    const newTokens = await this.query(`INSERT INTO tokens (access_token, refresh_token, refresh_expired_time, access_expired_time) 
    VALUES ('${accessToken}', '${refreshToken}', ${refreshExpiredTime}, ${accessExpiredTime}) RETURNING id;`);

    const tokenId = newTokens.rows[0].id
    const newAuthClient = await this.query(`INSERT INTO auth_client (hash, token_id) VALUES ('${hash}', ${tokenId}) RETURNING id;`);

    return { authId: newAuthClient.rows[0].id, accessToken, refreshToken }
  }

  getCred () {

  }

}

module.exports = AuthRepository
