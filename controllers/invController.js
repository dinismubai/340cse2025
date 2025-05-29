const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const { validationResult } = require("express-validator")


/* ***************************
 *  Build inventory by classification view
 * ************************** */
async function buildByClassificationId(req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

async function buildByInventoryId(req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getInventoryById(inv_id)
  const item = data[0]
  const nav = await utilities.getNav()
  res.render("./inventory/detail", {
    title: item.inv_make + " " + item.inv_model,
    nav,
    item,
  })
}

/* ***************************
 *  Build management view
 * ************************** */
async function buildManagementView(req, res) {
  const nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    message: req.flash("notice")
  })
}

/***********Add classification******** */
// Render form
async function buildAddClassification(req, res) {
  const nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    message: req.flash("notice"),
    errors: null
  })
}

// Process form submission
async function addClassification(req, res) {
  const { classification_name } = req.body
  const nav = await utilities.getNav()

  try {
    const result = await invModel.addClassification(classification_name)

    if (result) {
      req.flash("notice", `The classification "${classification_name}" was successfully added.`)
      const updatedNav = await utilities.getNav() // refresh nav
      return res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav: updatedNav,
        message: req.flash("notice"),
      })
    } else {
      req.flash("notice", "Sorry, classification could not be added.")
      return res.status(500).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        message: req.flash("notice"),
        errors: null,
      })
    }
  } catch (error) {
    console.error(error)
    req.flash("notice", "Classification name may already exist or be invalid.")
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      message: req.flash("notice"),
      errors: null,
    })
  }
}

/***************Build Inventory, Add inventory*************** */
/* Render Add Inventory Form */
async function buildAddInventoryForm(req, res) {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    classificationList,
    message: req.flash("notice"),
    errors: null
  })
}

/* Process Add Inventory Submission */
async function addInventory(req, res) {
  const {
    classification_id, inv_make, inv_model, inv_year,
    inv_description, inv_image, inv_thumbnail,
    inv_price, inv_miles, inv_color
  } = req.body

  const errors = validationResult(req)
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList(classification_id)

  if (!errors.isEmpty()) {
    return res.status(400).render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classificationList,
      message: req.flash("notice"),
      errors: errors.array(),
      ...req.body
    })
  }

  try {
    const result = await invModel.addInventory(
      classification_id, inv_make, inv_model, inv_year,
      inv_description, inv_image, inv_thumbnail,
      inv_price, inv_miles, inv_color
    )

    if (result) {
      req.flash("notice", `The vehicle "${inv_make} ${inv_model}" was successfully added.`)
      res.redirect("/inventory")
    } else {
      req.flash("notice", "Sorry, the vehicle could not be added.")
      res.status(500).render("inventory/add-inventory", {
        title: "Add Vehicle",
        nav,
        classificationList,
        message: req.flash("notice"),
        errors: null,
        ...req.body
      })
    }
  } catch (error) {
    console.error(error)
    req.flash("notice", "Error adding vehicle. Please try again.")
    res.status(500).render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classificationList,
      message: req.flash("notice"),
      errors: null,
      ...req.body
    })
  }
}


const invCont = {
  buildByClassificationId,
  buildByInventoryId,
  buildManagementView,
  buildAddClassification,
  addClassification,
  buildAddInventoryForm,
  addInventory
}

module.exports = invCont
