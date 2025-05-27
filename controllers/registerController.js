const utilities = require("../utilities/")

/* ****************************************
*  Deliver Register view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    message: req.flash("notice")
  })
}

module.exports = {buildRegister }