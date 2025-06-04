const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')
const logValidate = require('../utilities/login-validation')
const errorController = require("../controllers/errorController")
const accountMiddleware = require('../utilities/account-middleware')

const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")

// Views
router.get("/login", accountController.buildLogin)
router.get("/register", accountController.buildRegister)

// Registration processing
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Login processing
router.post(
  "/login",
  logValidate.loginRules(),
  logValidate.checkLoginData,
  accountController.loginAccount
)

// Error route
router.get("/trigger-error", errorController.throwError)

// Rota de gestão de conta (após login)
//router.get("/", accountMiddleware.checkLogin, accountController.buildAccountManagement)

router.get("/", utilities.checkLogin, accountController.buildAccountManagement)

module.exports = router