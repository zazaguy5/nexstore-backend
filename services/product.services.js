const pool = require('../config/db');

// ฟังก์ชั่นดึงรายการ Products ทั้งหมด
async function products() {
  const result = await pool.query('SELECT * from products');
  return result.rows;
}

// ดึงข้อมูลสินค้าตามไอดี
async function getProductById(id) {
  const result = await pool.query('SELECT * FROM products WHERE products.id = $1', [id]);
  return result.rows;
}

// ดึงข้อมูลสินค้าตามไอดี
async function getProductById(id) {
  const result = await pool.query('SELECT * FROM products WHERE products.id = $1', [id]);
  return result.rows;
}

// ดึงตะกร้าสินค้าตามไอดีผู้ใช้

async function getCarts(id) {
  const result = await pool.query('SELECT * FROM carts WHERE carts.userid = $1', [id]);
  return result.rows;
}

module.exports = { products, getProductById, getCarts };