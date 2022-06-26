const express = require('express')
const cookieParser = require('cookie-parser');

const cors = require('./src/middleware/cors')
const { initAuthRouts, initMedicationsRouts, initUsersRouts } = require('./src/routs/index')
const {initAuthController, initMedicationController, initUsersController} = require('./src/controller/index')
const repository = require('./src/repository/index')
const config = require('./config/config.json')

const methods = "POST, OPTIONS"
const currentRepository = repository(config.database)
const app = express()

app.use(express.json());
app.use((req, res, next) => cors(req, res, next, methods));
app.use(cookieParser("secret"));
app.use('/', express.static(__dirname + '/dist'))
app.use('/api/auth', initAuthRouts(express.Router(), initAuthController(currentRepository, config), config))
app.use('/api/medications', initMedicationsRouts(express.Router(), initMedicationController(currentRepository), config))
app.use('/api/users', initUsersRouts(express.Router(), initUsersController(currentRepository), config))

app.listen(config.port)
