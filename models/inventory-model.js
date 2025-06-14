const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getInventoryById(inv_id) {
  try {
    const result = await pool.query(
      "SELECT * FROM public.inventory WHERE inv_id = $1",
      [inv_id]
    )
    return result.rows
  } catch (error) {
    console.error("getInventoryById error " + error)
  }
}
async function getInventoryById_toPurchase(inv_id) {
  try {
    const sql = `
      SELECT 
        i.inv_id, i.inv_make, i.inv_model, i.inv_year, 
        i.inv_description, i.inv_image, i.inv_thumbnail, 
        i.inv_price, i.inv_miles, i.inv_color, 
        i.classification_id, c.classification_name
      FROM inventory i
      JOIN classification c ON i.classification_id = c.classification_id
      WHERE i.inv_id = $1
    `
    const result = await pool.query(sql, [inv_id])
    return result.rows[0] // devolve um único objeto, como a view espera
  } catch (error) {
    console.error("getInventoryById error:", error)
    throw error
  }
}


async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    const data = await pool.query(sql, [classification_name])
    return data.rows[0]
  } catch (error) {
    throw error
  }
}

/****************Add Inventory********************** */
async function addInventory(
  classification_id, inv_make, inv_model, inv_year,
  inv_description, inv_image, inv_thumbnail,
  inv_price, inv_miles, inv_color
) {
  try {
    const sql = `
      INSERT INTO inventory (
        classification_id, inv_make, inv_model, inv_year, 
        inv_description, inv_image, inv_thumbnail,
        inv_price, inv_miles, inv_color
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *;
    `
    const values = [
      classification_id, inv_make, inv_model, inv_year,
      inv_description, inv_image, inv_thumbnail,
      inv_price, inv_miles, inv_color
    ]
    const result = await pool.query(sql, values)
    return result.rows[0]
  } catch (error) {
    console.error("addInventory error: " + error)
    return null
  }
}

async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM inventory WHERE classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("Error getting inventory by classification:", error)
    throw error
  }
}

async function getInventoryItemById(inv_id) {
  try {
    const result = await pool.query(
      "SELECT * FROM inventory WHERE inv_id = $1",
      [inv_id]
    )
    return result.rows[0]
  } catch (error) {
    console.error("Model error getting inventory item:", error)
    throw error
  }
}

/* *****************************
*   Update Inventory Item
* ***************************** */
async function updateInventory(
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
) {
  try {
    const sql = `
      UPDATE public.inventory
      SET 
        inv_make = $1,
        inv_model = $2,
        inv_description = $3,
        inv_image = $4,
        inv_thumbnail = $5,
        inv_price = $6,
        inv_year = $7,
        inv_miles = $8,
        inv_color = $9,
        classification_id = $10
      WHERE inv_id = $11
      RETURNING *;
    `

    const data = [
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
      inv_id
    ]

    const result = await pool.query(sql, data)
    return result.rows[0] // Retorna o veículo atualizado
  } catch (error) {
    console.error("updateInventory error:", error)
    throw error
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql = `
      UPDATE public.inventory 
      SET 
        inv_make = $1,
        inv_model = $2,
        inv_description = $3,
        inv_image = $4,
        inv_thumbnail = $5,
        inv_price = $6,
        inv_year = $7,
        inv_miles = $8,
        inv_color = $9,
        classification_id = $10
      WHERE inv_id = $11
      RETURNING *;
    `

    const values = [
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
      inv_id
    ]

    const result = await pool.query(sql, values)
    return result.rows[0]
  } catch (error) {
    console.error("updateInventory error: " + error)
    return null
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventory(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
    return data.rowCount // returns 1 if deleted, 0 if nothing deleted
  } catch (error) {
    console.error("Delete Inventory Error:", error)
    throw new Error("Delete Inventory Error")
  }
}




module.exports = { 
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  addInventory,
  getInventoryByClassificationId,
  getInventoryItemById,
  updateInventory,
  deleteInventory,
  getInventoryById_toPurchase,
 };