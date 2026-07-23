const productService = require('../services/product.services');

async function getProducts(req, res, next) {
  try {
    const result = await productService.products();
    res.status(200).json({
      status: 'success',
      message: 'Get product successfully!',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

async function getProductById(req, res, next) {
  const { id } = req.params;

  try {
    const result = await productService.getProductById(id);
    if (result === 0) {
      res.status(400).json({
        status: 'failed',
        message: 'Product not found!',
        data: []
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'Get product successfully!',
      data: result
    });
  } catch (error) {
    next(error);
  } 
}

async function getCarts(req, res, next) {
  const { id } = req.params;

  try {
    const result = await productService.getCarts(id);
    if (result === 0) {
      res.status(400).json({
        status: 'failed',
        message: 'Cart not found!',
        data: []
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'Get carts successfully!',
      data: result
    });
  } catch (error) {
    next(error);
  } 
}

module.exports = { getProducts, getProductById, getCarts };