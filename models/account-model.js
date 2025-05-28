//const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
/*async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}*/

const pool = require("../database/")

async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = `
      INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES ($1, $2, $3, $4, 'Client')
      RETURNING *;
    `
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    return result.rows[0] // <-- retorna apenas o registo inserido
  } catch (error) {
    console.error("Erro ao registar conta:", error)
    throw error // <-- lança o erro corretamente para o controller tratar
  }
}


module.exports = {
  registerAccount}