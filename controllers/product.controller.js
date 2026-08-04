const productService = require('../services/product.services');

async function getProducts(req, res, next) {
  try {
    const result = await productService.products();
    res.status(result.code).json({
      status: result.status,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
}

async function getProductById(req, res, next) {
  const { id } = req.params;

  try {
    const result = await productService.getProductById(id);
    res.status(result.code).json({
      status: result.status,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    next(error);
  } 
}

async function getCarts(req, res, next) {
  const { id } = req.params;

  try {
    const result = await productService.getCarts(id);
    res.status(result.code).json({
      status: result.status,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    next(error);
  } 
}

async function countCarts(req, res, next) {
  const { id } = req.params;

  try {
    const result = await productService.countCarts(id);
    res.status(result.code).json({
      status: result.status,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    next(error);
  } 
}

async function addCart(req, res, next) {
  try {
    const result = await productService.addCart({ userId: req.body.userid, productId: req.body.productid, quantity: req.body.quantity });
    res.status(result.code).json({
      status: result.status,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getProducts, getProductById, getCarts, countCarts, addCart };