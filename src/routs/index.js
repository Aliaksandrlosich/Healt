const AuthRouts = require('./auth/index')
const MedicationRouts = require('./medication/index')

module.exports = {
  initAuthRouts: AuthRouts.init,
  initMedicationRouts: MedicationRouts.init
}
