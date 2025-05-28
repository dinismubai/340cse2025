const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')
const errorController = require("../controllers/errorController")

const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController") // <-- correto

router.get("/login", accountController.buildLogin)
router.get("/register", accountController.buildRegister) // <- se implementado
//router.post("/register", accountController.registerAccount) // <- importante!
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)



router.get("/trigger-error", errorController.throwError)

module.exports = router