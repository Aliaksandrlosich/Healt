const AuthRouts = require('./auth/index')
const MedicationsRouts = require('./medication/index')
const UsersRouts = require('./users/index')

module.exports = {
  initAuthRouts: AuthRouts.init,
  initMedicationsRouts: MedicationsRouts.init,
  initUsersRouts:  UsersRouts.init
}
