const express = require('express');
const { getProducts, getProductById, getCarts, countCarts, addCart } = require('../controllers/product.controller');

const router = express.Router();

// ดึงรายการข้อมูล products ทั้งหมด
router.get('/', getProducts);

// ดึงรายการสินค้าตามไอดีสินค้า
router.get('/:id', getProductById);

// ดึงตะกร้าสินค้าตามไอดีผู้ใช้
router.get('/carts/:id', getCarts);

// ดึงจำนวนตะกร้าสินค้าตามไอดีผู้ใช้
router.get('/carts/count/:id', countCarts);

// เพิ่มสินค้าในตะกร้าสินค้า
router.post('/addCart', addCart);

module.exports = router;