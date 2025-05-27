// Needed Resources 
const express = require("express")
const router = new express.Router() 
const registerController = require("../controllers/registerController")
const errorController = require("../controllers/errorController")

//Registration route
router.get('/register', registerController.buildRegister)
router.post('/register', registerController.buildRegister)

// Route to intentionally trigger a 500 error (for testing)
router.get("/trigger-error", errorController.throwError)

module.exports = router