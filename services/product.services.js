const pool = require('../config/db');

// ฟังก์ชั่นดึงรายการ Products ทั้งหมด
async function products() {
  const result = await pool.query('SELECT * from products');
  return result.rows; 
}

module.exports = { products };