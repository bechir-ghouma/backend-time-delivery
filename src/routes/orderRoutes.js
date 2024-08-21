const express = require('express');
const orderController = require('../controllers/orderController');
const { orderValidationRules, validateOrder } = require('../validators/orderValidator');

const router = express.Router();

router.post('/', orderValidationRules(), validateOrder, orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.get('/:id/with-line-orders', orderController.getOrderByIdWithLineOrders);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
