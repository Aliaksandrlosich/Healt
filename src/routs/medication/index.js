module.exports = module.exports = {
  init: (router, repository) => {
    router.get('/', async function (req, res) {
      try {
        res.send('get List')
      } catch (e) {
        console.log(`get List:${e}`);
        res.status(500).send('Error')
      }
    })

    router.post('/', async function (req, res) {
      try {
        res.send('add new')
      } catch (e) {
        console.log(`add new:${e}`);
        res.status(500).send('Error')
      }
    })

    router.get('/:medicationId', async function (req, res) {
      try {
        res.send('get medication')
      } catch (e) {
        console.log(`get medication:${e}`);
        res.status(500).send('Error')
      }
    })

    router.patch('/:medicationId', async function (req, res) {
      try {
        res.send('change medication')
      } catch (e) {
        console.log(`change medication:${e}`);
        res.status(500).send('Error')
      }
    })

    router.delete('/:medicationId', async function (req, res) {
      try {
        res.send('delete medication')
      } catch (e) {
        console.log(`delete new:${e}`);
        res.status(500).send('Error')
      }
    })


    return router
  }
}
