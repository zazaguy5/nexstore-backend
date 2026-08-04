const pool = require('../config/db');
const apiMsg = require('../models/api_msg');

// ฟังก์ชั่นดึงรายการ Products ทั้งหมด
async function products() {
  const result = await pool.query('SELECT * from products');
  return apiMsg(200, 'success', 'Products retrieved', result.rows);
}

// ดึงข้อมูลสินค้าตามไอดี
async function getProductById(id) {
  const result = await pool.query('SELECT * FROM products WHERE products.id = $1', [id]);
  return apiMsg(200, 'success', 'Product retrieved', result.rows);
}

// ดึงข้อมูลสินค้าตามไอดี
async function getProductById(id) {
  const result = await pool.query('SELECT * FROM products WHERE products.id = $1', [id]);
  return apiMsg(200, 'success', 'Product retrieved', result.rows);
}

// ดึงตะกร้าสินค้าตามไอดีผู้ใช้
async function getCarts(id) {
  const result = await pool.query('SELECT carts.id, carts.userid, products.id AS product_id, products.name, cart_items.quantity, products.price, carts.createdat FROM carts JOIN cart_items ON cart_items.cardid = carts.id JOIN products ON products.id = cart_items.productid WHERE carts.userid = $1', [id]);
  return apiMsg(200, 'success', 'Carts retrieved', result.rows);
}

// ดึงจำนวนตะกร้าสินค้าตามไอดีผู้ใช้
async function countCarts(id) {
  const result = await pool.query('SELECT COUNT(*) FROM carts WHERE carts.userid = $1', [id]);
  return apiMsg(200, 'success', 'Carts counted', result.rows);
}

// เพิ่มสินค้าในตะกร้าสินค้า
async function addCart({ userId, productId, quantity }) {
  const addCart = await pool.query('INSERT INTO carts (userId) VALUES ($1) RETURNING id', [userId]);

  const addCartItem = await pool.query('INSERT INTO cart_items ("cardid", "productid", "quantity") VALUES ($1, $2, $3)', [addCart.rows[0].id, productId, quantity]);
  return apiMsg(200, 'success', 'Cart item added', { cartId: addCart.rows[0].id, productId, quantity });
}

module.exports = { products, getProductById, getCarts, countCarts, addCart };