const express = require('express');
const CartRouter = express.Router();
const { addtoCart, getCartItems, removeFromCart } = require('../controllers/cartController');
const Authorization = require('../middleware/auth');



CartRouter.post('/add-to-cart', Authorization, addtoCart);
CartRouter.get('/get-cart-item', Authorization, getCartItems);
CartRouter.delete('/remove-from-cart/:id', Authorization, removeFromCart);
  


module.exports = CartRouter;