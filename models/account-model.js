const pool = require("../database")
const bcrypt = require("bcryptjs")

async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    //const hashedPassword = await bcrypt.hash(account_password, 10)
    const sql = `
      INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES ($1, $2, $3, $4, 'Client')
      RETURNING *
    `
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password,])
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

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

async function getAccountById(accountId) {
  const data = await pool.query("SELECT * FROM account WHERE account_id = $1", [accountId])
  return data.rows[0]
}

async function updateAccount({ account_id, account_firstname, account_lastname, account_email, account_password }) {
  if (account_password) {
    const sql = `UPDATE account
                 SET account_firstname = $1,
                     account_lastname = $2,
                     account_email = $3,
                     account_password = $4
                 WHERE account_id = $5`
    const data = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password, account_id])
    return data.rowCount
  } else {
    const sql = `UPDATE account
                 SET account_firstname = $1,
                     account_lastname = $2,
                     account_email = $3
                 WHERE account_id = $4`
    const data = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
    return data.rowCount
  }
}
async function updatePassword(account_id, hashedPassword) {
  try {
    const sql = `UPDATE account SET account_password = $1 WHERE account_id = $2`
    const data = await pool.query(sql, [hashedPassword, account_id])
    return data.rowCount
  } catch (error) {
    console.error("Model password update error:", error)
    return null
  }
}





module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword
}