const orderService = require('../services/orderService');
const { broadcast, notifyClient } = require('../../websocket');

class OrderController {
  // async createOrder(req, res) {
  //   try {
  //     console.log("body",req.body);
  //     const order = await orderService.createOrder(req.body, req.body.lineOrders);
  //     res.status(201).json(order);
  //   } catch (err) {
  //     res.status(400).json({ error: err.message });
  //   }
  // }
  async createOrder(req, res) {
    try {
      console.log("body", req.body);
      const order = await orderService.createOrder(req.body, req.body.lineOrders);
      
      // Broadcast the new order to all connected clients
      broadcast({
        type: 'NEW_ORDER',
        payload: {
          order,
          restaurantId: order.restaurant_id, // Assuming this exists in your order object
          timestamp: new Date().toISOString()
        }
      });

      // If you have a specific client/restaurant to notify
      if (order.restaurant_id) {
        notifyClient(order.restaurant_id.toString(), {
          type: 'NEW_ORDER_FOR_RESTAURANT',
          payload: order
        });
      }

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

  async getOrdersByStatusAndRestaurant(req, res) {
    const { restaurant_id } = req.params; // Obtenir le restaurant_id depuis les paramètres de la requête

    try {
      const orders = await orderService.getOrdersByStatusAndRestaurant(restaurant_id);
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getOrdersByRestaurant(req, res) {
    try {
      const { restaurant_id } = req.params; // Récupérer l'ID du restaurant depuis les paramètres de l'URL
      const orders = await orderService.getOrdersByRestaurant(restaurant_id);
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async markOrderAsReady(req, res) {
    try {
      const { orderId } = req.params; // Récupérer l'ID de la commande depuis les paramètres de l'URL
      const updatedOrder = await orderService.updateOrderStatusToReady(orderId);
      res.json(updatedOrder);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getOrdersByDeliveryPerson(req, res) {
    try {
      const { deliveryPersonId } = req.params;
      console.log(deliveryPersonId);// Récupérer l'ID du livreur passé en paramètre
      const orders = await orderService.getOrdersByDeliveryPerson(deliveryPersonId);
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  async getOrdersByClientId(req, res) {
    const { client_id } = req.params; // Get the client ID from the request parameters
  
    try {
      const orders = await orderService.getOrdersByClientId(client_id);
      if (orders.length > 0) {
        res.json(orders);
      } else {
        res.status(404).json({ error: 'No orders found for this client' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  
  
}

module.exports = new OrderController();
