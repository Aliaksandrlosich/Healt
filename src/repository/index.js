const AuthRepository = require('./Auth')
const UserRepository = require('./User')
const MedicationRepository = require('./Medication')

module.exports = (config) => {
  const auth = new AuthRepository(config)
  const user = new UserRepository(config)
  const medication = new MedicationRepository(config)
  return { auth, user, medication }
}
