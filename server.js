const express = require('express')

const config = require('./config/config.json')
const auth = require('./src/routs/auth/index')
const medication = require('/src/routs/medication/index')

const app = express()

app.use('/', express.static(__dirname + '/dist'))
app.use(express.json());
app.use('/auth', auth.init(express.Router(), {}))
app.use('/medication', medication.init(express.Router(), {}))

app.listen(config.port)
