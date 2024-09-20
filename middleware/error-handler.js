const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong, try again later',
  }

  if (err.name === 'ValidationError') {
    customError.message = Object.values(err.errors).map((item) => item.message).join(',')
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  if (err.code || err.code === 11000) {
    customError.message = `Duplicate value entered for ${Object.keys(err.keyValue)}, Please enter another value`
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  if (err.name === 'CastError') {
    customError.message = `No item found with id: ${err.value._id || err.value}`
    customError.statusCode = StatusCodes.NOT_FOUND
  }

  return res.status(customError.statusCode).json({ message: customError.message })
}

module.exports = errorHandlerMiddleware;