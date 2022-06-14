module.exports = module.exports = {
  init: (router, controller) => {
    try {
      router.post('/login', async function (req, res) {
        try {
          res.send('login')
        } catch (e) {
          console.log(`login error:${e}`)
          res.status(500).send('Error')
        }
      })

      router.post('/registration', async function (req, res) {
        try {
          res.send('registration')
        } catch (e) {
          console.log(`registration error:${e}`)
          res.status(500).send('Error')
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
  }
}
