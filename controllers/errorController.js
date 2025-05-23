// controllers/errorController.js
const errorController = {}

errorController.throwError = (req, res, next) => {
  const error = new Error("Intentional Server Error for testing purposes.")
  error.status = 500
  next(error)
}

module.exports = errorController
