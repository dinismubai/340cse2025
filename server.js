/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const session = require("express-session")
const pool = require('./database/')
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
app.use(express.static("public"))
const static = require("./routes/static")
//Added during week's 3 assignment - DMM
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")
const errorRoute = require("./routes/errorRoute")
const accountRoute = require("./routes/accountRoute")
const registerRoute = require("./routes/registerRoute")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")



/* ***********************
 * View Engine and Templates 
 *************************/
/* ***********************
 * Middleware
 * ************************/
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})


app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(cookieParser())

app.use(utilities.checkJWTToken)

/* ***********************
 * Routes
 *************************/
app.use(static)
app.use("/", errorRoute)


// Index route
//Commented out during week's 3 assignment - DMM
/*app.get("/", (req, res) => {
  res.render("index", { title: "Home" })
})*/
//Added during week's 3 assignment - DMM
app.get("/", utilities.handleErrors(baseController.buildHome))
// Inventory routes
app.use("/inv", inventoryRoute)
app.use("/inventory", inventoryRoute)
// Account routes
app.use("/account", accountRoute)
// Register routes
app.use("/register", registerRoute)

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  let nav = await utilities.getNav()
  let message = err.status === 404 ? err.message : 'Oh no! There was a crash. Maybe try a different route?'
  
  res.status(err.status || 500).render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
