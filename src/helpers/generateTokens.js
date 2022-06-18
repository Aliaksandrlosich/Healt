const crypto = require('crypto')

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

exports.generateAccessToken = async (username) => {
  const bufferData = `{username: ${username}, timestamp: ${Date.now()}}`
  const buff = await Buffer.from(bufferData)
  return await buff.toString('base64')
}
