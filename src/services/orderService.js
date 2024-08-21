const { Order, LineOrder } = require('../../models');

class OrderService {
  async createOrder(orderData, lineOrders) {
    let total = 0;
    if (lineOrders && lineOrders.length > 0) {
      total = lineOrders.reduce((acc, lineOrder) => {
        return acc + (lineOrder.quantity * lineOrder.unit_price);
      }, 0);
    }

    orderData.total = total;

    const transaction = await Order.sequelize.transaction();

    try {
      const order = await Order.create(orderData, { transaction });

      if (lineOrders && lineOrders.length > 0) {
        for (const lineOrderData of lineOrders) {
          await LineOrder.create({ ...lineOrderData, order_id: order.id }, { transaction });
        }
      }

      await transaction.commit();
      return order;
    } catch (err) {
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
    return Order.findByPk(orderId, {
      include: [{
        model: LineOrder,
        as: 'lines_order'
      }]
    });
  }

  async deleteOrder(orderId) {
    const order = await this.getOrderById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    await Order.destroy({ where: { id: orderId } });
    return order;
  }
}

module.exports = new OrderService();
