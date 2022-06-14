const express = require('express')

const config = require('./config/config.json')
const { initAuthRouts, initMedicationRouts } = require('./src/routs/index')
const {initAuthController, initMedicationController} = require('./src/controller/index')

const app = express()

app.use('/', express.static(__dirname + '/dist'))
app.use(express.json());
app.use('/auth', initAuthRouts(express.Router(), initAuthController({})))
app.use('/medication', initMedicationRouts(express.Router(), initMedicationController({})))

app.listen(config.port)
