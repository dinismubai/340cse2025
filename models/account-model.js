const pool = require("../database")
const bcrypt = require("bcryptjs")

async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const sql = `
      INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES ($1, $2, $3, $4, 'Client')
      RETURNING *
    `
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, hashedPassword])
    return result.rows[0]
  } catch (error) {
    console.error("Error registering account:", error)
    throw error
  }
}

async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    throw error
  }
}

async function getAccountByEmail(email) {
  try {
    const result = await pool.query("SELECT * FROM account WHERE account_email = $1", [email])
    return result.rows[0]
  } catch (error) {
    throw error
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
}
