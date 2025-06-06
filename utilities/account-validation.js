//const utilities = require(".")
const utilities = require("../utilities/")

const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")

const validate = {}

/* Registration Data Validation Rules */
validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),
  
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),
  
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email")
        }
      }),
  
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* Check registration data */
validate.checkRegistrationData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    res.render("account/register", {
      title: "Registration",
      nav,
      errors,
      message: null,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/* Account update rules */
validate.updateAccountRules = () => {
  return [
    body("account_firstname").trim().notEmpty().withMessage("First name is required."),
    body("account_lastname").trim().notEmpty().withMessage("Last name is required."),
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required.")
      .normalizeEmail(),
  ]
}

/* Password-only update rules */
validate.passwordOnlyRules = () => {
  return [
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
      .withMessage("Password must be at least 8 characters and include uppercase, lowercase, and a number."),
  ]
}

/* Check account update data */
validate.checkUpdateAccountData = async (req, res, next) => {
  const errors = validationResult(req)
  const nav = await utilities.getNav()

  if (!errors.isEmpty()) {
    return res.render("account/edit-account", {
      title: "Edit Account",
      nav,
      errors: errors.array(),
      message: null,
      account: req.body
    })
  }
  next()
}

/* Check password-only data */
validate.checkPasswordOnly = async (req, res, next) => {
  const errors = validationResult(req)
  const nav = await utilities.getNav()

  if (!errors.isEmpty()) {
    return res.render("account/edit-account", {
      title: "Edit Account",
      nav,
      errors: errors.array(),
      message: null,
      account: req.body
    })
  }
  next()
}

/* Export only once */
module.exports = validate