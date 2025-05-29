const express = require("express")
const router = new express.Router()

const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities/")
const errorController = require("../controllers/errorController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to get a single inventory item's details
router.get("/detail/:inv_id", invController.buildByInventoryId)

// Route to trigger an error for testing
router.get("/trigger-error", errorController.throwError)

// Route to inventory management view
router.get("/", invController.buildManagementView)

// Routes to render forms
router.get("/add-classification", invController.buildAddClassification)
router.get("/add-inventory", invController.buildAddInventoryForm)

// Route to process form with validation
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  invController.addInventory
)

router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  invController.addClassification
)

module.exports = router
