const bcrypt = require('bcrypt');
const crypto = require('crypto');
const pool = require('../config/db');
const apiMsg = require('../models/api_msg');

// ฟังก์ชั่นจัดการเข้าสู่ระบบ
async function login(username, password) {
  // เช็คบัญชีที่มาจาก request ว่ามีอยู่จริงหรือไม่
  const result = await pool.query('select "id", "name", "password" from users where users."accname" = $1', [username]);

  if (result.rows.length > 0) {
    const user = result.rows[0];
    //console.log(`user id: ${user.id}, username: ${user.accname}`);
    // เช็ครหัสผ่าน ใช้ bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      return apiMsg(200, 'success', 'Login success', { userId: user.id, name: user.name });
    } else {
      return apiMsg(400, 'failed', 'Invalid password');
    }
  } else {
    return apiMsg(400, 'failed', 'Username not found');
  }
}

async function register(bodyDto) {
  // format เวลาและวันที่ให้อ่านง่าย
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  const { name, accname, password, startdate } = bodyDto;
  // เข้ารหัสผ่าน encript
  const hashedPassword = await hashPassword(password);

  // เช็คบัญชีในระบบ
  const existingUser = await pool.query('select "accname" from users where users."accname" = $1', [accname]);

  if (existingUser.rowCount === 0) {
    const result = await pool.query(
      'insert into users ("name", "accname", "password", "startdate", "createddate", "createdtime", "role") VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [name, accname, hashedPassword, startdate, formattedDate, formattedTime, "Customer"]
    );
    if (!result) {
      return apiMsg(500, 'failed', 'Failed to register user');
    }
    return apiMsg(200, 'success', 'Created account');
  } else {
    return apiMsg(400, 'failed', 'Account already exists!');
  }

  return true;
}

// ฟังก์ชั่นสร้างเลข OTP สำหรับรีเซ็ตรหัสผ่าน
async function getOTP(body) {
  const { email, number } = body;
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP หมดเวลา 5 นาที

  // ไม่มี email หรือเบอร์โทร
  if (!email && !number) {
    return apiMsg(400, 'error', 'Please enter email or number.');
  }

  // หากมี OTP เก่าของเบอร์หรืออีเมลนี้ให้อัพเดตเป็นใช้ไปแล้ว กัน Server งง
  if (email) {
    await pool.query(
      'UPDATE otp SET is_used = TRUE WHERE email = $1 AND is_used = FALSE',
      [email]
    );
  }

  if (number) {
    await pool.query(
      `UPDATE otp SET is_used = TRUE WHERE number = $1 AND is_used = FALSE`,
      [number]
    );
  }

  const result = await pool.query(
    `INSERT INTO otp ("otp", "email", "number", "expires_at") VALUES ($1, $2, $3, $4) RETURNING id`,
    [otp, email || null, number || null, expiresAt]
  );

  // ส่ง otp ผ่าน email service (เช่น nodemailer) หรือ SMS service

  return apiMsg(200, 'success', 'Send OTP success', { otpId: result.rows[0].id });
}

// ฟังก์ชั่นจัดการเข้าสู่ระบบ
async function verifyOTP({ email, number, otp }) {
  const field = email ? 'email' : 'number';
  const value = email || number;

  const result = await pool.query(
    `SELECT * FROM otp WHERE ${field} = $1 AND is_used = FALSE ORDER BY created_at DESC LIMIT 1`,
    [value]
  );
  const record = result.rows[0];
  if (!record) {
    return apiMsg(400, 'error', 'OTP is not found or used!');
  }

  if (new Date() > new Date(record.expires_at)) {
    return apiMsg(400, 'error', 'OTP is expire!');
  }

  if (record.attemps >= 5) {
    return apiMsg(429, 'error', 'please request a new OTP.');
  }

  // ถ้า OTP ที่กรอกเข้ามาไม่ตรง
  if (record.otp !== otp) {
    await pool.query(`UPDATE otp SET attempts = attempts + 1 WHERE id = $1`, [record.id]);
    return apiMsg(400, 'error', 'OTP invaild!');
  }

  await pool.query(`UPDATE otp SET is_used = TRUE WHERE id = $1`, [record.id]);

  return apiMsg(200, 'success', 'OTP verification successful.');
}

function generateOTP() {
  let otp = "";
  while (otp.length < 6) {
    // Generate secure random bytes
    const byte = crypto.randomBytes(1)[0];
    if (byte < 250) { // Prevents modulo bias for an even distribution
      otp += byte % 10;
    }
  }
  return otp;
}

async function hashPassword(password) {
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

module.exports = { login, register, getOTP, verifyOTP };