const db = require('../db');

// Get all sweets
async function getAllSweets() {
  const res = await db.query('SELECT * FROM sweets');
  return res.rows;
}

// Add new sweet
async function addSweet({ name, category, price, quantity }) {
  const res = await db.query(
    'INSERT INTO sweets (name, category, price, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, category, price, quantity]
  );
  return res.rows[0];
}

// Update sweet
async function updateSweet(id, { name, category, price, quantity }) {
  const res = await db.query(
    `UPDATE sweets 
     SET name = $1, category = $2, price = $3, quantity = $4 
     WHERE id = $5 
     RETURNING *`,
    [name, category, price, quantity, id]
  );
  return res.rows[0];
}

// Delete sweet
async function deleteSweet(id) {
  await db.query('DELETE FROM sweets WHERE id = $1', [id]);
}

// Purchase sweet
async function purchaseSweet(id, qty) {
  const res = await db.query('SELECT quantity FROM sweets WHERE id = $1', [id]);
  const currentQty = res.rows[0]?.quantity || 0;

  if (qty > currentQty) {
    throw new Error('Insufficient stock');
  }

  const update = await db.query(
    'UPDATE sweets SET quantity = quantity - $1 WHERE id = $2 RETURNING *',
    [qty, id]
  );
  return update.rows[0];
}

// Restock sweet
async function restockSweet(id, qty) {
  const res = await db.query(
    'UPDATE sweets SET quantity = quantity + $1 WHERE id = $2 RETURNING *',
    [qty, id]
  );
  return res.rows[0];
}

// Search sweets
async function searchSweets({ name, category, minPrice, maxPrice }) {
  let query = 'SELECT * FROM sweets WHERE 1=1';
  const params = [];
  let index = 1;

  if (name) {
    query += ` AND name ILIKE $${index++}`;
    params.push(`%${name}%`);
  }
  if (category) {
    query += ` AND category ILIKE $${index++}`;
    params.push(`%${category}%`);
  }
  if (minPrice) {
    query += ` AND price >= $${index++}`;
    params.push(minPrice);
  }
  if (maxPrice) {
    query += ` AND price <= $${index++}`;
    params.push(maxPrice);
  }

  const res = await db.query(query, params);
  return res.rows;
}

// Export all functions
module.exports = {
  getAllSweets,
  addSweet,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
  searchSweets
};
