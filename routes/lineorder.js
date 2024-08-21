const express = require('express');
const { LineOrder } = require('../models');
const router = express.Router();

// Create a new line order
router.post('/', async (req, res) => {
  try {
    const lineOrder = await LineOrder.create(req.body);
    res.status(201).json(lineOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all line orders
router.get('/', async (req, res) => {
  try {
    const lineOrders = await LineOrder.findAll();
    res.json(lineOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get line order by ID
router.get('/:id', async (req, res) => {
  try {
    const lineOrder = await LineOrder.findByPk(req.params.id);
    if (lineOrder) {
      res.json(lineOrder);
    } else {
      res.status(404).json({ error: 'Line order not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
