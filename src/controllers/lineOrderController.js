const lineOrderService = require('../services/lineOrderService');

class LineOrderController {
  async createLineOrder(req, res) {
    try {
      const lineOrder = await lineOrderService.createLineOrder(req.body);
      res.status(201).json(lineOrder);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getAllLineOrders(req, res) {
    try {
      const lineOrders = await lineOrderService.getAllLineOrders();
      res.json(lineOrders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getLineOrderById(req, res) {
    try {
      const lineOrder = await lineOrderService.getLineOrderById(req.params.id);
      if (lineOrder) {
        res.json(lineOrder);
      } else {
        res.status(404).json({ error: 'Line order not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteLineOrder(req, res) {
    try {
      await lineOrderService.deleteLineOrder(req.params.id);
      res.status(204).json();
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }
}

module.exports = new LineOrderController();
