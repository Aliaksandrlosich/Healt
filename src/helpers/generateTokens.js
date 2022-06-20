const crypto = require('crypto')
const jwt = require('jsonwebtoken')

exports.generateRefreshToken = async () => {
  const buffer = await new Promise((resolve, reject) => {
    crypto.randomBytes(256, function (ex, buffer) {
      if (ex) {
        reject('error generating token')
      }
      resolve(buffer)
    })
  })
  const token = crypto.createHash('sha1').update(buffer).digest('hex')

  return token
}

exports.generateAccessToken = async ({ username, timestamp, tokenKey, accessExpiresInHours }) => {
  return await jwt.sign(
    { username: username, timestamp },
    tokenKey,
    {
      expiresIn: `${accessExpiresInHours}h`,
    },
  )
}
