const express = require("express")
const router = new express.Router()

const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')
const accountValidate = require('../utilities/account-validation')
const logValidate = require('../utilities/login-validation')
const errorController = require("../controllers/errorController")
const invController = require("../controllers/invController")
const accountController = require("../controllers/accountController")

const { checkLogin, enrichAccountData } = require("../utilities/account-middleware")
const { checkAdminOrEmployee } = require("../utilities/authMiddleware")

// Public views
router.get("/login", accountController.buildLogin)
router.get("/register", accountController.buildRegister)

// Registration processing
router.post(
  "/register",
  accountValidate.registrationRules(),
  accountValidate.checkRegistrationData,
  accountController.registerAccount
)

// Login processing
router.post(
  "/login",
  logValidate.loginRules(),
  logValidate.checkLoginData,
  accountController.loginAccount
)

// Logout
router.get("/logout", accountController.logoutAccount)

// Error route
router.get("/trigger-error", errorController.throwError)

// Authenticated route with enriched data
router.get("/", checkLogin, enrichAccountData, (req, res, next) => {
  const accountType = res.locals.accountData.account_type
  if (accountType === 'Admin' || accountType === 'Employee') {
    return invController.buildManagementView(req, res, next)
  }
  return accountController.buildAccountManagement(req, res, next)
})

// Update account form (with enriched account data if needed)
router.get("/update/:accountId", checkLogin, enrichAccountData, accountController.buildUpdateAccountForm)

// Update account processing
router.post(
  "/update",
  checkLogin,
  accountValidate.updateAccountRules(),
  accountValidate.checkUpdateAccountData,
  accountController.updateAccount
)

// View para editar conta (protege com autenticação)
router.get("/edit/:accountId", checkLogin, accountController.buildEditAccountView)

// Submeter info da conta (protege)
router.post(
  "/update-info",
  checkLogin,
  accountValidate.updateAccountRules(),
  accountValidate.checkUpdateAccountData,
  accountController.updateAccount
)

// Submeter nova password (protege)
router.post(
  "/update-password",
  checkLogin,
  accountValidate.passwordOnlyRules(),
  accountValidate.checkPasswordOnly,
  accountController.updatePassword
)

module.exports = router