// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const errorController = require("../controllers/errorController")

//Registration routes
router.get('/register', accountController.buildRegister)
router.post('/register', accountController.registerAccount)

// Route to intentionally trigger a 500 error (for testing)
router.get("/trigger-error", errorController.throwError)

module.exports = router
