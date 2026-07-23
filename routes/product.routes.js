const express = require('express');
const { getProducts, getProductById, getCarts } = require('../controllers/product.controller');

const router = express.Router();

// ดึงรายการข้อมูล products ทั้งหมด
router.get('/', getProducts);

// ดึงรายการสินค้าตามไอดีสินค้า
router.get('/:id', getProductById);

// ดึงตะกร้าสินค้าตามไอดีผู้ใช้
router.get('/carts/:id', getCarts);

module.exports = router;