// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
//Error 500 Import
const errorController = require("../controllers/errorController")

//Working on Week's 3 assignment
// Route to get a single inventory item's details
router.get("/detail/:inv_id", invController.buildByInventoryId)
router.get("/trigger-error", errorController.throwError)

module.exports = router;