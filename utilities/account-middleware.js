const jwt = require("jsonwebtoken")

function checkLogin(req, res, next) {
  const token = req.cookies.jwt
  if (!token) {
    req.flash("notice", "You must be logged in to view this page.")
    return res.redirect("/account/login")
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    res.locals.accountData = decoded
    next()
  } catch (err) {
    req.flash("notice", "Session expired. Please log in again.")
    res.clearCookie("jwt")
    return res.redirect("/account/login")
  }
}

module.exports = { checkLogin }
