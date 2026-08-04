const express = require('express');
const { login, register, getOTP, verifyOTP } = require('../controllers/user.controller');

const router = express.Router();

// เข้าสู่ระบบ
router.post('/login', login);

// สมัครบัญชีผู้ใช้
router.post('/register', register);

// สร้าง OTP สำหรับแก้ไขรหัสผ่าน
router.post('/getOTP', getOTP);

// ตรวจ OTP เพื่อยืนยันตัวตน
router.post('/verifyOTP', verifyOTP);

module.exports = router;