const bcrypt = require('bcrypt');
const pool = require('../config/db');

// ฟังก์ชั่นจัดการเข้าสู่ระบบ
async function login(username, password) {
  // เช็คบัญชีที่มาจาก request ว่ามีอยู่จริงหรือไม่
  const result = await pool.query('select "accName", "password" from users where users."accName" = $1', [username]);
  const user = result.rows[0];
  // เช็ครหัสผ่าน ใช้ bcrypt
  const isPasswordValid = await bcrypt.compare(password, user.password);

  // ไม่มีบัญชีที่ใส่เข้ามาหรือรหัสผ่านไม่ถูกต้อง
  if (result.rows.length === 0 || !isPasswordValid) {
    throw new Error('Invalid username or password');
    return false;
  } else {
    return true;
  }
}

async function register(userDto) {
  // format เวลาและวันที่ให้อ่านง่าย
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  const { name, accName, password, startDate } = userDto;
  // เข้ารหัสผ่าน encript
  const hashedPassword = await hashPassword(password);

  // เช็คบัญชีในระบบ
  const existingUser = await pool.query('select "accName" from users where users."accName" = $1', [accName]);
  if (existingUser.rowCount > 0) {
    throw new Error('Account already exists');
  }

  const result = await pool.query(
    'insert into users ("name", "accName", "password", "startDate", "createdDate", "createdTime") VALUES ($1, $2, $3, $4, $5, $6)',
    [name, accName, hashedPassword, startDate, formattedDate, formattedTime]
  );
  if (!result) {
    throw new Error('Failed to register user');
    return false;
  }
  return true;
}

async function hashPassword(password) {
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

module.exports = { login, register };