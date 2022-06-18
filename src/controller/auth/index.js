const Controller = require('../Controller')
const { generateRefreshToken, generateAccessToken } = require('../../helpers/generateTokens')
const { hToMs } = require('../../helpers/time')

class Auth extends Controller {
  constructor (repository) {
    super(repository)
  }

  async registration ({ username, hash }) {
    try {
      const user = await this.repository.user.getUser({ username })
      let result = { type: '' }
      const userEmpty = user.rows.length === 0
      if (userEmpty) {
        const generatedTokens = await this.#generateTokens(username)
        const accessExpiredTime = Date.now() + hToMs(1)
        const refreshExpiredTime = Date.now() + hToMs(20)
        const newAuth = await this.repository.auth.addNewCred({
          hash, accessExpiredTime, refreshExpiredTime, ...generatedTokens,
        })
        const newUser = await this.repository.user.addNewUser({ username, authId: newAuth.authId })
        result.message = 'SUCCESS'
      } else {
        result.message = 'NOT_UNIQ_USERNAME'
      }

      return result
    } catch (e) {
      console.error('Auth registration error')
      console.error(e.stack)
      throw e
    }
  }

  async #generateTokens ({ username }) {
    const accessToken = await generateAccessToken(username)
    const refreshToken = await generateRefreshToken()
    return { accessToken, refreshToken }
  }
}

module.exports = Auth
