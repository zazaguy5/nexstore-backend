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

module.exports = { getProducts };