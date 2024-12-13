const express = require('express');
const orderController = require('../controllers/orderController');
const { orderValidationRules, validateOrder } = require('../validators/orderValidator');
const router = express.Router();


router.get('/pending', orderController.getPendingOrders);
router.put('/:orderId/assign/:deliveryPersonId', orderController.assignOrderToDeliveryPerson);
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
router.post('/restaurant/:id_restaurant/orders-by-date', orderController.getOrdersByRestaurantAndDate);
router.post('/livreur/:id_livreur/orders-by-date', orderController.getOrdersByLivreurAndDate);
// New route for updating order status
//router.patch('/:orderId/status', orderController.updateOrderStatus);
router.put('/:orderId/status', orderController.updateOrderStatus);

router.get('/status/:status', orderController.getOrdersByStatus);


module.exports = router;
