// Garantir que o utilizador tem sessão ativa antes de aceder a certas rotas

function checkLogin(req, res, next) {
  if (req.session && req.session.account) {
    return next() // Está autenticado
  } else {
    req.flash("notice", "Acesso restrito. Por favor, faça login.")
    return res.redirect("/account/login")
  }
}

// Verificar se é um administrador ou funcionário

function checkAdminOrEmployee(req, res, next) {
  if (req.session && req.session.account &&
      (req.session.account.account_type === 'Admin' ||
       req.session.account.account_type === 'Employee')) {
    return next()
  } else {
    req.flash("notice", "Acesso negado. Permissões insuficientes.")
    return res.redirect("/account/")
  }
}

// 

function addAccountToLocals(req, res, next) {
  if (req.cookies.jwt) {
    try {
      const jwt = require("jsonwebtoken")
      const decoded = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
      res.locals.account = decoded
    } catch (err) {
      res.locals.account = null
    }
  } else {
    res.locals.account = null
  }
  next()
}

module.exports = {
  checkLogin,
  checkAdminOrEmployee,
  addAccountToLocals,
}
