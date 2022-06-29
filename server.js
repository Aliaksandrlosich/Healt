const express = require('express')
const cookieParser = require('cookie-parser');

const cors = require('./src/middleware/cors')

const { initAuthRouts, initMedicationsRouts, initUsersRouts } = require('./src/routs/index')
const {initAuthDomain, initMedicationDomain, initUsersDomain} = require('./src/domain/index')
const repository = require('./src/repository/index')
const config = require('./config/config.json')
const auth = require('./src/middleware/auth')

const currentRepository = repository(config.database)

const app = express()

const authRouts = initAuthRouts(express.Router(), initAuthDomain(currentRepository, config), config)
const medicationsRouts = initMedicationsRouts(express.Router(), initMedicationDomain(currentRepository), config)
const usersRouts = initUsersRouts(express.Router(), initUsersDomain(currentRepository), config)

app.use(express.json());
app.options('*', cors)
app.use(cors);
app.use(cookieParser("secret"))
app.use('/', express.static(__dirname + '/dist'))
app.use('/api/auth',  authRouts)
app.use('/api/medications', auth(initAuthDomain(currentRepository, config)), medicationsRouts)
app.use('/api/users', auth(initAuthDomain(currentRepository, config)), usersRouts)

app.listen(config.port)
