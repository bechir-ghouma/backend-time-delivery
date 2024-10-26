const express = require('express');
const orderController = require('../controllers/orderController');
const { orderValidationRules, validateOrder } = require('../validators/orderValidator');

const router = express.Router();

router.post('/', orderValidationRules(), validateOrder, orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.get('/:id/with-line-orders', orderController.getOrderByIdWithLineOrders);
router.get('/status/pending-and-preparing/:restaurant_id', orderController.getOrdersByStatusAndRestaurant);
router.get('/restaurant/:restaurant_id', orderController.getOrdersByRestaurant);
router.delete('/:id', orderController.deleteOrder);
router.put('/:orderId/ready', orderController.markOrderAsReady);
router.get('/delivery-person/:deliveryPersonId', orderController.getOrdersByDeliveryPerson);
router.get('/client/:client_id', orderController.getOrdersByClientId);

module.exports = router;
