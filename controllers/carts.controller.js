const cartsService = require('../services/carts.services');

async function getCarts(req, res, next) {
    try {
        const result = await cartsService.carts(req.body.userid);
        res.status(200).json({
            status: 'success',
            message: 'Get carts successfully!',
            data: result
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { getCarts };