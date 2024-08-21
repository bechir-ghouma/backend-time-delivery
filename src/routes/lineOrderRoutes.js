const express = require('express');
const lineOrderController = require('../controllers/lineOrderController');
const { lineOrderValidationRules, validateLineOrder } = require('../validators/lineOrderValidator');

const router = express.Router();

router.post('/', lineOrderValidationRules(), validateLineOrder, lineOrderController.createLineOrder);
router.get('/', lineOrderController.getAllLineOrders);
router.get('/:id', lineOrderController.getLineOrderById);
router.delete('/:id', lineOrderController.deleteLineOrder);

module.exports = router;
