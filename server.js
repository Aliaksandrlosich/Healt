const express = require('express')

const cors = require('./src/middleware/cors')
const { initAuthRouts, initMedicationRouts } = require('./src/routs/index')
const {initAuthController, initMedicationController} = require('./src/controller/index')
const repository = require('./src/repository/index')
const config = require('./config/config.json')

const methods = "POST, OPTIONS"
const currentRepository = repository(config.database)
const app = express()

app.use(express.json());
app.use((req, res, next) => cors(req, res, next, methods));
app.use('/', express.static(__dirname + '/dist'))
app.use('/auth', initAuthRouts(express.Router(), initAuthController(currentRepository)))
app.use('/medication', initMedicationRouts(express.Router(), initMedicationController(currentRepository)))

app.listen(config.port)
