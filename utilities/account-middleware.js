const jwt = require("jsonwebtoken")
const accountModel = require("../models/account-model")

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

async function enrichAccountData(req, res, next) {
  try {
    if (res.locals.accountData && res.locals.accountData.account_id) {
      const fullAccountData = await accountModel.getAccountById(res.locals.accountData.account_id)
      if (fullAccountData) {
        res.locals.accountData = fullAccountData
      }
    }
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = { checkLogin, enrichAccountData }
