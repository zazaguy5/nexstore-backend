const express = require('express');
const { getCarts } = require('../controllers/carts.controller');

const router = express.Router();

// ดึงรายการรถเข็นของผู้ใช้
router.post('/carts', getCarts);

module.exports = router;