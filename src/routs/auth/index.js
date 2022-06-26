const cookie = require('cookie')
const { hToS } = require('../../helpers/time')

module.exports = {
  init: (router, controller, config) => {
    try {
     const refreshCookieMaxAge = hToS(config.auth.refreshExpiresInHours)
     const accessCookieMaxAge = hToS(config.auth.accessExpiresInHours)
      router.post('/login', async function (req, res) {
        try {
          console.log('routs: Initiate login')
          const { username, password } = req.body
          if (password && username) {
            const result = await controller.authorization({ username, password })
            const { userId, statusCode, error, message, accessToken, refreshToken } = result
            if (statusCode === 200) {
              res.setHeader('Set-Cookie', [
                cookie.serialize('refreshToken', refreshToken,
                  { maxAge: refreshCookieMaxAge, httpOnly: true, path: '/api', domain: config.domain }),
                cookie.serialize('accessToken', accessToken,
                  { maxAge: accessCookieMaxAge, httpOnly: true, path: '/api', domain: config.domain }),
              ])
            }

            res.status(result.statusCode).json({ userId, error, message })
          } else {
            res.status(400).send({ error: 'INVALID_CREDENTIALS' })
          }
        } catch (e) {
          console.log(`login error:${e}`)
          res.status(500).send({ error: 'Error' })
        }
      })

      router.post('/registration', async function (req, res) {
        try {
          console.log('routs: Initiate registration')
          const { username, password } = req.body
          if (password && username) {
            const result = await controller.registration({ username, password })
            const { statusCode, accessToken, userId, refreshToken, error, message } = result
            if (statusCode === 200) {
              res.setHeader('Set-Cookie', [
                cookie.serialize('refreshToken', refreshToken,
                  { maxAge: refreshCookieMaxAge, httpOnly: true, path: '/api', domain: config.domain }),
                cookie.serialize('accessToken', accessToken,
                  { maxAge: accessCookieMaxAge, httpOnly: true, path: '/api', domain: config.domain }),
              ])
            }
            res.status(statusCode).json({ userId, error, message })
          } else {
            res.status(400).send('INVALID_CREDENTIALS')
          }
        } catch (e) {
          console.error(`registration error:${e.stack}`)
          res.status(500).send({ error: 'Error' })
        }
      })

      router.post('/logout', async function (req, res) {
        try {
          console.log('routs: Initiate logout')
          const { userId } = req.body
          const accessToken = req.cookies?.['accessToken']
          await res.clearCookie('refreshToken', { maxAge: 0, httpOnly: true, path: '/api', domain: config.domain })
          await res.clearCookie('accessToken', { maxAge: 0, httpOnly: true, path: '/api', domain: config.domain })

          const { statusCode, message } = await controller.logout({ userId, accessToken })
          res.status(statusCode).send({ message })
        } catch (e) {
          console.log(`logout error:${e.stack}`)
          res.status(500).send({ error: 'Error' })
        }
      })
    } catch (e) {
      console.error('Error init auth routers')
    }

    return router
  },
}
