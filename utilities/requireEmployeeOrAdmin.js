function requireEmployeeOrAdmin(req, res, next) {
  const account = req.session.account
  if (!account || (account.account_type !== "Employee" && account.account_type !== "Admin")) {
    req.flash("notice", "You must be logged in with proper privileges to access that page.")
    return res.redirect("/account/login")
  }
  next()
}

module.exports = requireEmployeeOrAdmin