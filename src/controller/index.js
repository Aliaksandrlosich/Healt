const AuthController = require('./auth/index')
const MedicationsController = require('./medication/index')
const UsersController = require('./users/index')

module.exports = {
  initAuthController: (authRepository, config) => {
    return new AuthController(authRepository, config)
  },
  initMedicationController: (medicationRepository) => {
    return new MedicationsController(medicationRepository)
  },
  initUsersController: (usersRepository)=> {
   return new UsersController(usersRepository)
  }
}
