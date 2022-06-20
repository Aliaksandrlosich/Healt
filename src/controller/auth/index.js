const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Controller = require('../Controller')
const { generateRefreshToken, generateAccessToken } = require('../../helpers/generateTokens')
const { hToMs } = require('../../helpers/time')

class Auth extends Controller {
  constructor (repository, config) {
    super(repository, config)
  }

  async registration ({ username, password }) {
    try {
      const user = await this.repository.user.getUser({ username })
      let result = { message: '' }
      if (user) {
        result = {
          error: 'NOT_UNIQ_USERNAME',
          statusCode: 409,
        }
      } else {
        const encryptedPassword = await bcrypt.hash(password, 1)
        const accessExpiredTime = Date.now() + hToMs(this.config.auth.accessExpiresInHours)
        const refreshExpiredTime = Date.now() + hToMs(this.config.auth.refreshExpiresInHours)
        const generatedTokens = await this.#generateTokens({ username, accessExpiredTime, refreshExpiredTime })
        const { refreshToken, accessToken, authId } = await this.repository.auth.addNewCred({
          hash: encryptedPassword, accessExpiredTime, refreshExpiredTime, ...generatedTokens,
        })
        const { userId } = await this.repository.user.addNewUser({ username, authId })
        result = {
          message: 'SUCCESS',
          statusCode: 200,
          userId,
          refreshToken,
          accessToken,
        }
      }

      return result
    } catch (e) {
      console.error('Auth registration error')
      console.error(e.stack)
      throw e
    }
  }

  async #generateTokens ({ username, accessExpiredTime, refreshExpiredTime }) {
    const accessToken = await generateAccessToken({
      timestamp: accessExpiredTime,
      tokenKey: this.config.auth.tokenKey,
      accessExpiresInHours: this.config.auth.accessExpiresInHours,
      username,
    })

    const refreshToken = await generateRefreshToken()
    return { accessToken, refreshToken }
  }

  async authorization ({ username, password }) {
    const user = await this.repository.user.getUser({ username })
    let result = { message: '' }
    const userEmpty = user.rows.length === 0
    if (userEmpty) {
      result = {
        error: 'INVALID_CREDENTIALS',
        statusCode: 400,
      }
    } else {
      console.log(user)
    }
    return result
  }

  async logout ({ userId }) {
    let result
    const user = await this.repository.user.getUser({ id: userId })
    const { auth_client_id } = user
    await this.repository.auth.resetCred({ auth_client_id })
    if (user) {
      result = {
        message: 'SUCCESS',
        statusCode: 200,
      }
    } else {
      result = {
        message: 'UNDEFINED_USER',
        statusCode: 200,
      }
    }
    return result
  }
}

module.exports = Auth
