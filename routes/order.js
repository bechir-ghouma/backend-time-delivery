const express = require('express');
const { Order, LineOrder, sequelize } = require('../models');  // Import sequelize
const router = express.Router();

// Create a new order
router.post('/', async (req, res) => {
  const { lineOrders, ...orderData } = req.body;  // Destructure lineOrders and order data

  const transaction = await sequelize.transaction();

  try {
    // Calculate the total based on line orders
    let total = 0;
    if (lineOrders && lineOrders.length > 0) {
      total = lineOrders.reduce((acc, lineOrder) => {
        return acc + (lineOrder.quantity * lineOrder.unit_price);
      }, 0);
    }

    // Include the calculated total in the order data
    orderData.total = total;

    // Create the order
    const order = await Order.create(orderData, { transaction });

    // Create the associated line orders
    if (lineOrders && lineOrders.length > 0) {
      for (const lineOrderData of lineOrders) {
        await LineOrder.create({ ...lineOrderData, order_id: order.id }, { transaction });
      }
    }

    // Commit the transaction
    await transaction.commit();

    res.status(201).json(order);
  } catch (err) {
    // Rollback the transaction in case of error
    await transaction.rollback();
    res.status(400).json({ error: err.message });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
