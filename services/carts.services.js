const pool = require('../config/db');

// ดึงรายการรถเข็นที่ผู้ใช้กดไว้
async function carts(userId) {
    const result = await pool.query('SELECT * from carts where userid=$1', [userId]);
    return result.rows;
}

module.exports = { carts };