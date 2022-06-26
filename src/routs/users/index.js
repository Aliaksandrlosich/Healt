module.exports = {
 init: (router, controller, config) => {
  try {
   router.get('/:userId', async function (req, res) {
    try {
     console.log('get user')
     const { userId } = req.params
     const result = await controller.getUser({userId})
     const { statusCode, error, message, username } = result
     console.log(statusCode)
     res.status(statusCode).send({ message, username, error, userId  })
    } catch (e) {
     console.log(`getUser error:${e.stack}`)
     res.status(500).send({ error: 'Error' })
    }

   })
  } catch (e) {
   console.error('Error init users routers')
  }
  return router
 }
}
