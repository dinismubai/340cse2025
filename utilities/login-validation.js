const { body, validationResult } = require("express-validator")
const utilities = require("../utilities/")
const validate = {} // <-- DEFINIR AQUI ANTES DE USAR

/* ****************************************
 * Login Data Validation Rules
 * **************************************** */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ]
}

/* ****************************************
 * Check login data and return errors or continue
 * **************************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors,
      message: null,
      account_email,
    })
    return
  }
  next()
}

module.exports = validate
