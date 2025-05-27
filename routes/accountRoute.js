// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const errorController = require("../controllers/errorController")

//Registration route
router.get('/login', accountController.buildLogin)
//router.post('/register', registerController.buildLogin)

// Route to intentionally trigger a 500 error (for testing)
router.get("/trigger-error", errorController.throwError)

module.exports = router