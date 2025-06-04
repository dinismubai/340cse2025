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
  const nav = await utilities.getNav()
  const className = data[0]?.classification_name || "Unknown"
  res.render("./inventory/classification", {
    title: `${className} vehicles`,
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
    title: `${item.inv_make} ${item.inv_model}`,
    nav,
    item,
  })
}

/* ***************************
 *  Build management view
 * ************************** */
async function buildManagementView(req, res) {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()

  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationList,
    message: req.flash("notice")
  })
}

/*********** Add classification ******** */
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
      const updatedNav = await utilities.getNav()
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

/*************** Add inventory *************** */
// Render Add Inventory Form
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

// Process To Add Inventory Item
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

// JSON API for dynamic inventory fetching
async function getInventoryJSON(req, res) {
  const classification_id = req.params.classification_id
  const inventoryData = await invModel.getInventoryByClassificationId(classification_id)
  res.json(inventoryData)
}

// Build Edit Inventory View
async function buildEditInventoryView(req, res) {
  const inv_id = req.params.inv_id

  try {
    const itemData = await invModel.getInventoryItemById(inv_id)
    console.log("Classification ID:", itemData.classification_id)
    const classificationList = await utilities.buildClassificationList(itemData.classification_id)
    const nav = await utilities.getNav()

    res.render("inventory/edit-inventory", {
      title: `Edit ${itemData.inv_make} ${itemData.inv_model}`,
      nav,
      classificationList,
      message: null,
      errors: [],
      ...itemData
    })
  } catch (error) {
    console.error("Error building edit inventory view:", error)
    res.status(500).render("errors/error", {
      title: "Server Error",
      message: "Failed to load vehicle for editing",
      nav: await utilities.getNav()
    })
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventory(req, res, next) {
  const nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)

  try {
    const deleteResult = await invModel.deleteInventory(inv_id)

    if (deleteResult) {
      req.flash("notice", "The vehicle was successfully deleted.")
      return res.redirect("/inv/")
    } else {
      req.flash("notice", "Sorry, the delete failed.")
      return res.redirect(`/inv/delete/${inv_id}`)
    }
  } catch (error) {
    console.error("Delete Error:", error)
    req.flash("notice", "Sorry, there was a server error.")
    return res.redirect(`/inv/delete/${inv_id}`)
  }
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(req, res, next) {
  let nav = await utilities.getNav()

  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  try {
    const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    )

    if (updateResult) {
      const itemName = inv_make + " " + inv_model
      req.flash("notice", `The ${itemName} was successfully updated.`)
      return res.redirect("/inv/")
    } else {
      const classificationList = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the update failed.")
      return res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationList,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      })
    }
  } catch (error) {
    console.error("Update Error:", error)
    const classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, there was a server error.")
    return res.status(500).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}

// Build Delete Inventory Confirmation View
async function buildDeleteInventoryView(req, res) {
  const inv_id = req.params.inv_id

  try {
    const itemData = await invModel.getInventoryItemById(inv_id)
    const nav = await utilities.getNav()
    const name = `${itemData.inv_make} ${itemData.inv_model}`

    res.render("inventory/delete-confirm", {
      title: `Delete ${name}`,
      nav,
      message: null,
      errors: [],
      ...itemData
    })
  } catch (error) {
    console.error("Error building delete confirmation view:", error)
    res.status(500).render("errors/error", {
      title: "Server Error",
      message: "Failed to load vehicle for deletion",
      nav: await utilities.getNav()
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
  addInventory,
  getInventoryJSON,
  buildEditInventoryView,
  updateInventory,
  buildDeleteInventoryView,
  deleteInventory,
}

module.exports = invCont