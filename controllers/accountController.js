const bcrypt = require("bcryptjs")
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/*******************************
 * Build Login View
 *******************************/
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    message: req.flash("notice")
  })
}

/*******************************
 * Build Register View
 *******************************/
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    message: req.flash("notice"),
    errors: null, // Para futuras validações do lado servidor
  })
}

/*******************************
 * Register Account
 *******************************/
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  try {
    // 1. Verifica se o email já está registado
    const emailExists = await accountModel.checkExistingEmail(account_email)
    if (emailExists) {
      req.flash("notice", "Este email já está registado. Por favor, faça login.")
      return res.status(409).render("account/register", {
        title: "Register",
        nav,
        message: req.flash("notice"),
        errors: null,
      })
    }

    // 2. Hash da password
    const hashedPassword = await bcrypt.hash(account_password, 10)

    // 3. Regista conta usando o modelo
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    // 4. Se sucesso, redireciona para login com mensagem de sucesso
    req.flash("notice", `Congrats, ${account_firstname}, your account was created successfully.`)
    return res.status(201).render("account/login", {
      title: "Login",
      nav,
      message: req.flash("notice"),
    })

  } catch (error) {
    console.error("🔴 Registration error:", error)
    req.flash("notice", "Something went wrong. Please try again.")
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      message: req.flash("notice"),
      errors: null,
    })
  }
}

//Login Account
async function loginAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      message: req.flash("notice"),
      account_email,
    })
  }

  try {
    const passwordMatches = await bcrypt.compare(account_password, accountData.account_password)

    if (passwordMatches) {
      // Segurança: não guardar password
      delete accountData.account_password

      // Guardar dados na sessão
      req.session.account = accountData

      // JWT opcional
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      const cookieOptions = {
        httpOnly: true,
        maxAge: 3600 * 1000,
        secure: process.env.NODE_ENV !== 'development'
      }
      res.cookie("jwt", accessToken, cookieOptions)

      // Redirecionamento baseado no tipo
      if (accountData.account_type === 'Employee' || accountData.account_type === 'Admin') {
        return res.redirect('/inv/')
      } else {
        return res.redirect('/account/')
      }
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        message: req.flash("notice"),
        account_email,
      })
    }
  } catch (error) {
    console.error("Login error:", error)
    req.flash("notice", "Something went wrong. Try again.")
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      message: req.flash("notice"),
      account_email,
    })
  }
}

//Account logout
function logoutAccount(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err)
      req.flash("notice", "Logout failed. Please try again.")
      return res.redirect("/account")
    }
    res.clearCookie("connect.sid") // limpa cookie da sessão
    res.clearCookie("jwt")         // limpa JWT se quiseres
    res.redirect("/")
  })
}



/*******************************
 * Build Account Management View
 *******************************/
async function buildAccountManagement(req, res) {
  const nav = await utilities.getNav()
  res.render("account/account", {
    title: "Account Management",
    nav,
    message: req.flash("notice"),
    errors: null,
  })
}




module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  loginAccount,
  buildAccountManagement,
  logoutAccount,
}