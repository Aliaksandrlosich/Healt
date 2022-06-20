const { hToS } = require('../../helpers/time')

module.exports = {
  init: (router, controller, config) => {
    try {
      router.post('/login', async function (req, res) {
        try {
          console.log('routs: Initiate login')
          const { username, password } = req.body
          if (password && username) {
            const result = await controller.authorization({ username, password })
            res.status(result.statusCode).send({ error: result.error })
          } else {
            res.status(400).send({ error: 'All input is required' })
          }
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
            res.cookie('access-token', accessToken,
              { maxAge: accessCookieMaxAge, httpOnly: true, path: '/api', domain: config.domain })
            res.cookie('refresh-token', refreshToken,
              { maxAge: refreshCookieMaxAge, httpOnly: true, path: '/api/auth', domain: config.domain })
            res.status(statusCode).send({ userId, error })
          } else {
            res.status(400).send('All input is required')
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
          console.log(req.body)
          res.cookie('access-token', '', { maxAge: 0, httpOnly: true })
          res.cookie('refresh-token', '', { maxAge: 0, httpOnly: true })

          const result = await controller.logout({ userId })
          res.status(result.statusCode).send({ message: result.message })
        } catch (e) {
          console.log(`logout error:${e.stack}`)
          res.status(500).send({ error: 'Error' })
        }
      })
    } catch (e) {
      console.error('Error init auth router')
    }

    return router
  },
}
