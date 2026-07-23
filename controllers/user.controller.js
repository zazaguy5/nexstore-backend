// ดึง Service ทั้งหมดของ Users
const userService = require('../services/user.services');

async function login(req, res, next) {
  try {
    const result = await userService.login(req.body.username, req.body.password);
    res.status(result.code).json({
      status: result.status,
      message: result.message,
      data: result.data ?? []
    });
  } catch (error) {
    next(error);
  }
}

async function register(req, res, next) {
  try {
    const result = await userService.register(req.body);
    res.status(result.code).json({
      status: result.status,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { login, register };