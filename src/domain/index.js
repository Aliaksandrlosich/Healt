const AuthDomain = require('./auth/index')
const MedicationsDomain = require('./medication/index')
const UsersDomain = require('./users/index')

module.exports = {
  initAuthDomain: (authRepository, config) => {
    return new AuthDomain(authRepository, config)
  },
  initMedicationDomain: (medicationRepository) => {
    return new MedicationsDomain(medicationRepository)
  },
  initUsersDomain: (usersRepository)=> {
   return new UsersDomain(usersRepository)
  }
}
