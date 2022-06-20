const AuthController = require('./auth/index')
const MedicationController = require('./medication/index')

module.exports = {
  initAuthController: (authRepository, config) => {
    return new AuthController(authRepository)
  },
  initMedicationController: (medicationRepository) => {
    return new MedicationController(medicationRepository)
  }
}
