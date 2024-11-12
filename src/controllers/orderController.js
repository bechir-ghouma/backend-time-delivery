const orderService = require('../services/orderService');
const { notifyClient, notifyRestaurant } = require('../../websocket');

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
      const orders = await orderService.createOrder(req.body, req.body.lineOrders);

      // Notifier le client une seule fois
      if (orders.length > 0) {
          notifyClient('customer', orders[0].client_id, {
              type: 'NEW_ORDER',
              orders: orders.map(order => ({
                  id: order.id,
                  status: order.status,
                  total: order.total,
                  created_at: order.created_at,
              }))
          });
      }

      // Notifier chaque restaurant pour chaque ordre créé
      orders.forEach(order => {
          notifyClient('restaurant', order.restaurant_id, {
              type: 'NEW_ORDER',
              order: {
                  id: order.id,
                  client_id: order.client_id,
                  items: order.lineOrders,
                  total: order.total,
                  status: order.status,
                  created_at: order.created_at,
              }
          });
      });

      res.status(201).json(orders);
  } catch (error) {
      console.error("Error creating grouped orders:", error);
      res.status(400).json({ error: 'Error creating grouped orders' });
  }
    /*try {
      const order = await orderService.createOrder(req.body, req.body.lineOrders);
      
      // Notify both client and restaurant
      notifyClient('customer', order.client_id, {
        type: 'NEW_ORDER',
        order: {
          id: order.id,
          status: order.status,
          total: order.total,
          created_at: order.created_at
        }
      });

      notifyClient('restaurant', order.restaurant_id, {
        type: 'NEW_ORDER',
        order: {
          id: order.id,
          client_id: order.client_id,
          items: order.lineOrders,
          total: order.total,
          status: order.status,
          created_at: order.created_at
        }
      });

      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(400).json({ error: 'Error creating order' });
    }*/
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
    const { restaurant_id } = req.params;

    try {
      const orders = await orderService.getOrdersByStatusAndRestaurant(restaurant_id);
      res.json(orders);
    } catch (err) {
      console.error("Error fetching orders by status:", err);
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

  // async markOrderAsReady(req, res) {
  //   try {
  //     const { orderId } = req.params; // Récupérer l'ID de la commande depuis les paramètres de l'URL
  //     const updatedOrder = await orderService.updateOrderStatusToReady(orderId);
  //     res.json(updatedOrder);
  //   } catch (err) {
  //     res.status(500).json({ error: err.message });
  //   }
  // }
  async markOrderAsReady(req, res) {
    try {
      const { orderId } = req.params;
      const updatedOrder = await orderService.updateOrderStatusToReady(orderId);
      
      // Notify client that order is ready
      notifyClient('customer', updatedOrder.client_id, {
        type: 'ORDER_READY',
        order: {
          id: updatedOrder.id,
          status: updatedOrder.status,
          ready_at: new Date()
        }
      });

      // Also notify delivery person if assigned
      if (updatedOrder.delivery_person_id) {
        notifyClient('delivery', updatedOrder.delivery_person_id, {
          type: 'ORDER_READY_FOR_PICKUP',
          order: {
            id: updatedOrder.id,
            restaurant_id: updatedOrder.restaurant_id,
            status: updatedOrder.status
          }
        });
      }

      res.json(updatedOrder);
    } catch (err) {
      console.error("Error marking order as ready:", err);
      res.status(500).json({ error: err.message });
    }
  }
  async getOrdersByDeliveryPerson(req, res) {
    try {
      const { deliveryPersonId } = req.params;
      const orders = await orderService.getOrdersByDeliveryPerson(deliveryPersonId);
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching delivery person orders:", error);
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

  async getOrdersByRestaurantAndDate(req, res) {
    const { id_restaurant } = req.params;
    const { date } = req.body;

    try {
      const orders = await orderService.getOrdersByRestaurantAndDate(id_restaurant, date);
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders by restaurant and date:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }
  // Add method to update order status with notifications
  async updateOrderStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      
      const updatedOrder = await orderService.updateOrderStatus(orderId, status);
      
      // Notify all relevant parties about status change
      const notifications = {
        'PREPARING': {
          client: 'ORDER_PREPARING',
          restaurant: 'ORDER_IN_PREPARATION'
        },
        'READY': {
          client: 'ORDER_READY',
          delivery: 'ORDER_READY_FOR_PICKUP'
        },
        'DELIVERED': {
          client: 'ORDER_DELIVERED',
          restaurant: 'ORDER_COMPLETED'
        }
      };

      if (notifications[status]) {
        // Notify client
        notifyClient('customer', updatedOrder.client_id, {
          type: notifications[status].client,
          order: {
            id: updatedOrder.id,
            status: status,
            updated_at: new Date()
          }
        });

        // Notify restaurant
        notifyClient('restaurant', updatedOrder.restaurant_id, {
          type: notifications[status].restaurant,
          order: {
            id: updatedOrder.id,
            status: status,
            updated_at: new Date()
          }
        });

        // Notify delivery person if assigned
        if (updatedOrder.delivery_person_id && notifications[status].delivery) {
          notifyClient('delivery', updatedOrder.delivery_person_id, {
            type: notifications[status].delivery,
            order: {
              id: updatedOrder.id,
              status: status,
              updated_at: new Date()
            }
          });
        }
      }

      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  }
  
  async getPendingOrders(req, res) {
    try {
      const orders = await orderService.getPendingOrders();
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching  orders:", error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  async assignOrderToDeliveryPerson(req, res) {
    const { orderId, deliveryPersonId } = req.params;

    try {
      const updatedOrder = await orderService.assignOrderToDeliveryPerson(orderId, deliveryPersonId);
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error('Error assigning order to delivery person:', error);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new OrderController();
