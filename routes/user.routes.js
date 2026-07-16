const express = require('express');
const { login, register } = require('../controllers/user.controller');

const router = express.Router();

// เข้าสู่ระบบ
router.post('/login', login);

// สมัครบัญชีผู้ใช้
router.post('/register', register);

module.exports = router;