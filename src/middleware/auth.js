const cookie = require('cookie')
const { hToS } = require('../helpers/time')

const auth = (authController) => async (req, res, next) => {
 const cookies = req.cookies
 console.log('check tokens')
 if (cookies.accessToken || cookies.refreshToken) {
  const { accessToken, refreshToken } = cookies
  const result = await authController.checkAuthorization({ accessToken, refreshToken })
  if (result.access) {
   if (result.accessToken) {
    const refreshCookieMaxAge = hToS(authController.config.auth.refreshExpiresInHours)
    const accessCookieMaxAge = hToS(authController.config.auth.accessExpiresInHours)
    res.setHeader('Set-Cookie', [
     cookie.serialize('refreshToken', refreshToken,
      { maxAge: refreshCookieMaxAge, httpOnly: true, path: '/api', domain: authController.config.domain }),
     cookie.serialize('accessToken', accessToken,
      { maxAge: accessCookieMaxAge, httpOnly: true, path: '/api', domain: authController.config.domain }),
    ])
   }
   next()
  } else {
   res.status(401).send({ message: 'Unauthorized' })
  }
 } else {
  res.status(401).send({ message: 'Unauthorized' })
 }
}

module.exports = auth
