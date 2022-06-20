const { hToS } = require('../../helpers/time')

module.exports = {
  init: (router, controller, config) => {
    try {
      router.post('/login', async function (req, res) {
        try {
          console.log(req.body)
          res.send('login')
        } catch (e) {
          console.log(`login error:${e}`)
          res.status(500).send('Error')
        }
      })

      router.post('/registration', async function (req, res) {
        try {
          console.log('routs: Initiate registration')
          const { username, password } = req.body
          if (password && username) {
            const result = await controller.registration({ username, password })
            const { statusCode, accessToken, userId, refreshToken, error } = result
            const refreshCookieMaxAge = hToS(config.auth.refreshExpiresInHours)
            const accessCookieMaxAge = hToS(config.auth.accessExpiresInHours)
            res.cookie('refresh-token', refreshToken, { maxAge: refreshCookieMaxAge, httpOnly: true, path: '/auth', domain: config.domain })
            res.cookie('access-token', refreshToken, { maxAge: accessCookieMaxAge, httpOnly: true, path: '/', domain: config.domain })
            res.status(statusCode).send({ userId, error })
          } else {
            res.status(400).send('All input is required')
          }
        } catch (e) {
          console.error(`registration error:${e}`)
          res.status(500).send({ error: 'Error' })
        }
      })

      router.post('/logout', async function (req, res) {
        try {
          res.send('logout')
        } catch (e) {
          console.log(`logout error:${e}`)
          res.status(500).send('Error')
        }
      })
    } catch (e) {
      console.error('Error init auth router')
    }

    return router
  },
}
