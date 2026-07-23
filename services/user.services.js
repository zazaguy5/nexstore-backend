const bcrypt = require('bcrypt');
const pool = require('../config/db');

// ฟังก์ชั่นจัดการเข้าสู่ระบบ
async function login(username, password) {
  // เช็คบัญชีที่มาจาก request ว่ามีอยู่จริงหรือไม่
  const result = await pool.query('select "id", "accname", "password" from users where users."accname" = $1', [username]);

  if (result.rows.length > 0) {
    const user = result.rows[0];
    //console.log(`user id: ${user.id}, username: ${user.accname}`);
    // เช็ครหัสผ่าน ใช้ bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      return { code: 200, status: 'success', message: 'Login success', data: { userId: user.id }};
    } else {
      return apiMsg(200, 'failed', 'Invalid password');
    }
  } else {
    return apiMsg(200, 'failed', 'Username not found');
  }
}

async function register(userDto) {
  // format เวลาและวันที่ให้อ่านง่าย
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  const { name, accname, password, startdate } = userDto;
  // เข้ารหัสผ่าน encript
  const hashedPassword = await hashPassword(password);

  // เช็คบัญชีในระบบ
  const existingUser = await pool.query('select "accname" from users where users."accname" = $1', [accname]);

  if (existingUser.rowCount === 0) {
    const result = await pool.query(
      'insert into users ("name", "accname", "password", "startdate", "createddate", "createdtime") VALUES ($1, $2, $3, $4, $5, $6)',
      [name, accname, hashedPassword, startdate, formattedDate, formattedTime]
    );
    if (!result) {
      return apiMsg(500, 'failed', 'Failed to register user');
    }
    return apiMsg(200, 'success', 'Created account');
  } else {
    return apiMsg(200, 'failed', 'Account already exists!');
  }

  return true;
}

function apiMsg(code, status, message) {
  return { code: code, status: status, message: message };
}

async function hashPassword(password) {
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

module.exports = { login, register };