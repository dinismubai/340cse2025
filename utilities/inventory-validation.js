const { body, validationResult } = require("express-validator")
const utilities = require(".")

const classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 }).withMessage("Classification name is required.")
      .matches(/^[A-Za-z0-9]+$/).withMessage("No spaces or special characters allowed.")
  ]
}

const checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await require("../utilities/").getNav()
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      message: null,
      errors: errors.array()
    })
  }
  next()
}

const inventoryRules = () => {
  return [
    body("inv_make").trim().isLength({ min: 1 }).withMessage("Make is required."),
    body("inv_model").trim().isLength({ min: 1 }).withMessage("Model is required."),
    body("inv_year").isInt({ min: 1900, max: 2099 }).withMessage("Year must be a valid number."),
    body("inv_description").trim().isLength({ min: 1 }).withMessage("Description is required."),
    body("inv_image").trim().isLength({ min: 1 }).withMessage("Image path is required."),
    body("inv_thumbnail").trim().isLength({ min: 1 }).withMessage("Thumbnail path is required."),
    body("inv_price").isFloat({ min: 0 }).withMessage("Price must be a valid number."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Miles must be a valid number."),
    body("inv_color").trim().isLength({ min: 1 }).withMessage("Color is required."),
    body("classification_id").isInt().withMessage("Classification is required.")
  ]
}

const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(req.body.classification_id)
    return res.status(400).render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classificationList,
      message: req.flash("notice"),
      errors: errors.array(),
      ...req.body
    })
  }
  next()
}

module.exports = {
  classificationRules,
  checkClassificationData,
  inventoryRules,
  checkInventoryData
}
