const Controller = require('../Controller')

class Users extends Controller {
 constructor (repository, config) {
  super(repository, config)
 }

 async getUser ({ userId }) {
  try {
   let result
   const user = await this.repository.user.getUser({ id: userId })
   if (user) {
    const { username } = user
    result = {
     message: 'SUCCESS',
     statusCode: 200,
     userId,
     username

    }
   } else {
    result = {
     error: 'UNDEFINED_USER',
     statusCode: 400,
    }
   }
   return result
  } catch (e) {
   console.error('Auth authorization error')
   console.error(e.stack)
   throw e
  }
 }
}

module.exports = Users
