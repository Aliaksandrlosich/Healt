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
        const accessExpiredTime = this.#getAccessExpiredTime()
        const refreshExpiredTime = this.#getRefreshExpiredTime()
        const generatedTokens = await this.#generateTokens({ username, accessExpiredTime, refreshExpiredTime })
        const { refreshToken, accessToken, authId } = await this.repository.auth.addCred({
          hash: encryptedPassword, accessExpiredTime, refreshExpiredTime, ...generatedTokens,
        })
        const { userId } = await this.repository.user.addNewUser({ username, authId })
        result = {
          message: 'SUCCESS',
          statusCode: 201,
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

  #getAccessExpiredTime() {
    return Date.now() + hToMs(this.config.auth.accessExpiresInHours)
  }

  #getRefreshExpiredTime() {
    return Date.now() + hToMs(this.config.auth.refreshExpiresInHours)
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
    if (user) {
      const userAuth = await this.repository.auth.getCred({ authId: user.auth_client_id })
      const validCred = await bcrypt.compare(password, userAuth.hash)
      if(validCred) {
        const accessExpiredTime = this.#getAccessExpiredTime()
        const refreshExpiredTime = this.#getRefreshExpiredTime()
        const generatedTokens = await this.#generateTokens({ username, accessExpiredTime, refreshExpiredTime })
        await this.repository.auth.addToken({ authId: userAuth.id, refreshExpiredTime, accessExpiredTime, ...generatedTokens })

        result = {
          message: 'SUCCESS',
          statusCode: 200,
          userId: user.id,
          ...generatedTokens
        }
      } else {
        result = {
          error: 'INVALID_CREDENTIALS',
          statusCode: 400,
        }
      }
    } else {
      result = {
        error: 'INVALID_CREDENTIALS',
        statusCode: 400,
      }
    }
    return result
  }

  async logout ({ userId, accessToken }) {
    try{
      let result
      const user = await this.repository.user.getUser({ id: userId })
      if (user) {
        const { auth_client_id } = user
        await this.repository.auth.resetToken({ authId: auth_client_id, accessToken })
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
    } catch (e) {
      console.error('Auth authorization error')
      console.error(e.stack)
      throw e
    }
  }
}

module.exports = Auth
