const { Order, LineOrder, User,Menu } = require('../../models');

class OrderService {
  // async createOrder(orderData, lineOrders) {
  //   console.log("orderData",orderData);
  //   console.log("lineOrders",lineOrders);
  //   let total = 0;
  //   if (lineOrders && lineOrders.length > 0) {
  //     total = lineOrders.reduce((acc, lineOrder) => {
  //       return acc + (lineOrder.quantity * lineOrder.unit_price);
  //     }, 0);
  //   }

  //   orderData.total = total;

  //   const transaction = await Order.sequelize.transaction();

  //   try {
  //     const order = await Order.create(orderData, { transaction });

  //     if (lineOrders && lineOrders.length > 0) {
  //       for (const lineOrderData of lineOrders) {
  //         await LineOrder.create({ ...lineOrderData, order_id: order.id }, { transaction });
  //       }
  //     }

  //     await transaction.commit();
  //     return order;
  //   } catch (err) {
  //     await transaction.rollback();
  //     throw err;
  //   }
  // }
  async createOrder(orderData, lineOrders) {
    console.log("Order data received:", orderData);
    console.log("Line orders received:", lineOrders);

    let total = 0;
    if (lineOrders && lineOrders.length > 0) {
        total = lineOrders.reduce((acc, lineOrder) => acc + (lineOrder.quantity * lineOrder.unit_price), 0);
    }

    orderData.total = total;

    const transaction = await Order.sequelize.transaction();

    try {
        const order = await Order.create(orderData, { transaction });
        console.log("Order created:", order);

        if (lineOrders && lineOrders.length > 0) {
            for (const lineOrderData of lineOrders) {
                await LineOrder.create({ ...lineOrderData, order_id: order.id }, { transaction });
                console.log("Line order created:", lineOrderData);
            }
        }

        await transaction.commit();
        return order;
    } catch (err) {
        console.error("Transaction error:", err);
        await transaction.rollback();
        throw err;
    }
}


  async getAllOrders() {
    return Order.findAll();
  }

  async getOrderById(orderId) {
    return Order.findByPk(orderId);
  }

  async getOrderByIdWithLineOrders(orderId) {
    try {
      return await Order.findByPk(orderId, {
        include: [{
          model: LineOrder,
          as: 'lines_order',
          include: [{
            model: Menu,
            as: 'menu'
          }]
        }]
      });
    } catch (error) {
      console.error("Error fetching order with line orders:", error);
      throw error;
    }
  }

  async deleteOrder(orderId) {
    const order = await this.getOrderById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    await Order.destroy({ where: { id: orderId } });
    return order;
  }

  async getOrdersByStatusAndRestaurant(restaurantId)  {
    try {
      const response = await Order.findAll({
        where: {
          status: ['En Attente', 'Prête'],
          restaurant_id: restaurantId // Ajouter la condition pour le restaurant
        },
        include: [{
          model: User, // Inclure le modèle User pour les informations du client
          as: 'client',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }]
      });
      return response;
    } catch (error) {
      console.error('Error fetching orders by status and restaurant:', error);
      throw error;
    }
  };

  async getOrdersByRestaurant(restaurantId)  {
    try {
      const response = await Order.findAll({
        where: {
          restaurant_id: restaurantId
        },
        include: [{
          model: User,
          as: 'client',
          attributes: ['id', 'first_name', 'last_name', 'email'], // Inclure les infos du client
        }],
      });
      return response;
    } catch (error) {
      console.error('Error fetching orders by restaurant:', error);
      throw error;
    }
  };

  async updateOrderStatusToReady(orderId) {
    try {
      const order = await Order.findByPk(orderId);
  
      if (!order) {
        throw new Error('Order not found');
      }
  
      // Mettre à jour le statut à "Prête"
      order.status = "Prête";
      await order.save();
  
      return order;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  async getOrdersByDeliveryPerson(deliveryPersonId = null) {
    try {
      const whereCondition = deliveryPersonId
        ? { delivery_person_id: deliveryPersonId }
        : { delivery_person_id: null };
      console.log("service",deliveryPersonId);
      const orders = await Order.findAll({
        where: whereCondition,
        include: [
          {
            model: User, // Inclure les informations du client
            as: 'client',
            attributes: ['id', 'first_name', 'last_name', 'email'],
          },
          {
            model: User, // Inclure les informations du restaurant
            as: 'restaurant',
            attributes: ['id', 'first_name', 'last_name', 'email'],
          },
        ],
      });

      return orders;
    } catch (error) {
      console.error('Error fetching orders by delivery person:', error.message);
    console.error('Stack:', error.stack);
      throw error;
    }
  }

  async getOrdersByClientId(clientId) {
    return await Order.findAll({
      where: {
        client_id: clientId,
      },
      include: [
        { model: User, as: 'client' },
        { model: User, as: 'restaurant' },
        { model: User, as: 'delivery_person' },
        { model: LineOrder, as: 'lines_order' }, // Include line orders if necessary
      ],
    });
  }
  
}

module.exports = new OrderService();
