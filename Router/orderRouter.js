const express = require('express');
const orderRouter = express.Router();
const { CreateOrder, getAllOrders ,getOrderByUser,getOrderByEvent} = require('../controllers/orderController');
const Authorization = require('../middleware/auth');


orderRouter.post('/create-order', Authorization, CreateOrder);
// orderRouter.get('/get-order/:id', Authorization, getOrder);
orderRouter.get('/get-all-orders', Authorization, getAllOrders);
// orderRouter.get('/get-order-by-user/:user_id', Authorization, getOrderByUser);
// orderRouter.get('/get-order-by-event/:event_id', Authorization, getOrderByEvent);


module.exports = orderRouter;