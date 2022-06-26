module.exports = {
 init: (router, controller, config) => {
  try {
   router.get('/', async function (req, res) {
    try {
     res.send('get List')
    } catch (e) {
     console.log(`get List:${e}`)
     res.status(500).send('Error')
    }
   })

   router.post('/', async function (req, res) {
    try {
     console.log('Add new medication')
     const { userId, name, description, initCount, destinationCount } = req.body
     if (userId && name) {
      const result = await controller.addMedicationToList({ userId, name, description, initCount, destinationCount })
      const { statusCode, medicationId, message } = result
      res.status(statusCode).send({ medicationId, message })
     } else {
      res.status(400).send({ error: 'INVALID_INPUT' })
     }
    } catch (e) {
     console.log(`add new:${e}`)
     res.status(500).send('Error')
    }
   })

   router.get('/:medicationId', async function (req, res) {
    try {
     res.send('get medication')
    } catch (e) {
     console.log(`get medication:${e}`)
     res.status(500).send('Error')
    }
   })

   router.patch('/:medicationId', async function (req, res) {
    try {
     res.send('change medication')
    } catch (e) {
     console.log(`change medication:${e}`)
     res.status(500).send('Error')
    }
   })

   router.delete('/:medicationId', async function (req, res) {
    try {
     res.send('delete medication')
    } catch (e) {
     console.log(`delete new:${e}`)
     res.status(500).send('Error')
    }
   })

  } catch (e) {
   console.error('Error init medication router')
  }

  return router
 }
}
