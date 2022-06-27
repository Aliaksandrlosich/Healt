const Repository = require('./Repository')

class AuthRepository extends Repository {
 constructor (config) {
  super(config)
 }

 async addCred ({ hash }) {
  const newAuthClient = await this.query(`INSERT INTO auth_client (hash) VALUES ('${hash}') RETURNING id;`)

  return newAuthClient.rows[0].id
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
  const reset = await this.query(`DELETE FROM  tokens WHERE auth_client_id = ${authId} 
    AND  access_token = '${accessToken}';`)
  return true
 }

 async checkAccessToken ({ accessToken, currentTimestamp }) {
  const tokens = await this.query(`SELECT * FROM tokens WHERE access_token = '${accessToken}' 
        AND access_expired_time > ${currentTimestamp};`)

  return tokens.rows[0]
 }

 async checkRefreshToken ({ accessToken, refreshToken, currentTimestamp }) {
  const tokens = await this.query(`SELECT * FROM tokens WHERE access_token = '${accessToken}' 
        AND refresh_token = '${refreshToken}' AND access_expired_time < ${currentTimestamp} AND refresh_expired_time > ${currentTimestamp};`)

  return tokens.rows[0]
 }

}

module.exports = AuthRepository
