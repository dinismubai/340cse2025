//const pool = require("../config/db"); // ajusta conforme o teu ficheiro de conexão
const pool = require("../database")
const bcrypt = require("bcryptjs")

// Adiciona item ao carrinho
async function addToCart(account_id, classification_id, inv_id, cart_quantity, inv_make, inv_model) {
  const sql = `
    INSERT INTO cart (account_id, classification_id, inv_id, cart_quantity)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [account_id, classification_id, inv_id, cart_quantity];
  const result = await pool.query(sql, values);
  return result.rows[0];
}


// Busca itens do carrinho por utilizador
async function getCartSummary(account_id) {
  const sql = `
    SELECT c.cart_quantity, i.inv_id, i.inv_make, i.inv_model, i.inv_price, c.classification_id, cl.classification_name,
           a.account_firstname, a.account_email
    FROM cart c
    JOIN inventory i ON c.inv_id = i.inv_id
    JOIN classification cl ON i.classification_id = cl.classification_id
    JOIN account a ON c.account_id = a.account_id
    WHERE c.account_id = $1
  `
  const data = await pool.query(sql, [account_id])
  return data.rows
}

module.exports = {
  addToCart,
  getCartSummary
};
