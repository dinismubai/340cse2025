const utilities = require("../utilities/")
const accountModel = require("../models/account-model")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    message: req.flash("notice")
  })
}


async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  try {
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    )

    req.flash(
      "notice",
      `Congratulations, ${account_firstname}, Your account was registered successfuly.`
    )
 
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      message: req.flash("notice")
    })

  } catch (error) {
    req.flash("notice", "Sorry. Something went wrong. Try again")
    res.status(500).render("account/register", {
      title: "Register",
      nav,
      message: req.flash("notice")
    })
  }
}


/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    message: req.flash("notice"),
    errors: null, //added while working on server side validation
  })
}


module.exports = {
  buildLogin,
  buildRegister,
  registerAccount
}