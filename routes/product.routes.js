const express = require('express');
const { getProducts } = require('../controllers/product.controller');

const router = express.Router();

// ดึงรายการข้อมูล products ทั้งหมด
router.get('/', getProducts);

module.exports = router;