const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const authenticateUser = async (req, res, next) => {

  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication invalid')
  }
  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, KmDrEgqFmCKcbwEz85B4FrBKBInMCu2W)
    req.user = { userId: payload.userId, userName: payload.userName }
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
  }
}

module.exports = authenticateUser
