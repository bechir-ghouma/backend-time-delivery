const orderService = require('../services/orderService');

class OrderController {
  async createOrder(req, res) {
    try {
      const order = await orderService.createOrder(req.body, req.body.lineOrders);
      res.status(201).json(order);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getAllOrders(req, res) {
    try {
      const orders = await orderService.getAllOrders();
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await orderService.getOrderById(req.params.id);
      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ error: 'Order not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getOrderByIdWithLineOrders(req, res) {
    try {
      const order = await orderService.getOrderByIdWithLineOrders(req.params.id);
      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ error: 'Order not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteOrder(req, res) {
    try {
      await orderService.deleteOrder(req.params.id);
      res.status(204).json();
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }
}

module.exports = new OrderController();
