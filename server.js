const express = require('express')
const cookieParser = require('cookie-parser');

const cors = require('./src/middleware/cors')

const { initAuthRouts, initMedicationsRouts, initUsersRouts } = require('./src/routs/index')
const {initAuthController, initMedicationController, initUsersController} = require('./src/controller/index')
const repository = require('./src/repository/index')
const config = require('./config/config.json')
const auth = require('./src/middleware/auth')

const currentRepository = repository(config.database)

const app = express()

const authRouts = initAuthRouts(express.Router(), initAuthController(currentRepository, config), config)
const medicationsRouts = initMedicationsRouts(express.Router(), initMedicationController(currentRepository), config)
const usersRouts = initUsersRouts(express.Router(), initUsersController(currentRepository), config)

app.use(express.json());
app.options('*', cors)
app.use(cors);
app.use(cookieParser("secret"))
app.use('/', express.static(__dirname + '/dist'))
app.use('/api/auth',  authRouts)
app.use('/api/medications', auth(initAuthController(currentRepository, config)), medicationsRouts)
app.use('/api/users', auth(initAuthController(currentRepository, config)), usersRouts)

app.listen(config.port)
