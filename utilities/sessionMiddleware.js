function sessionAccountMiddleware(req, res, next) {
  res.locals.account = req.session.account
  next()
}

module.exports = sessionAccountMiddleware
