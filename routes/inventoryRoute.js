const express = require("express")
const router = new express.Router()

const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities/")
const errorController = require("../controllers/errorController")
const requireEmployeeOrAdmin = require("../utilities/requireEmployeeOrAdmin")

// ❌ Rotas públicas (sem middleware)
router.get("/type/:classificationId", invController.buildByClassificationId)
router.get("/detail/:inv_id", invController.buildByInventoryId)

// 🔧 API para Ajax (ex: dropdowns)
router.get("/getInventory/:classification_id", invController.getInventoryJSON)

// ✅ Área protegida (apenas Employee/Admin)
router.get("/", requireEmployeeOrAdmin, invController.buildManagementView)

router.get("/add-classification", requireEmployeeOrAdmin, invController.buildAddClassification)
router.post(
  "/add-classification",
  requireEmployeeOrAdmin,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  invController.addClassification
)

router.get("/add-inventory", requireEmployeeOrAdmin, invController.buildAddInventoryForm)
router.post(
  "/add-inventory",
  requireEmployeeOrAdmin,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

router.get(
  "/edit/:inv_id",
  requireEmployeeOrAdmin,
  utilities.handleErrors(invController.buildEditInventoryView)
)
router.post(
  "/edit/:inv_id",
  requireEmployeeOrAdmin,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

router.get(
  "/delete/:inv_id",
  requireEmployeeOrAdmin,
  utilities.handleErrors(invController.buildDeleteInventoryView)
)
router.post(
  "/delete/:inv_id",
  requireEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteInventory)
)

// Para teste de erro
router.get("/trigger-error", errorController.throwError)

module.exports = router
