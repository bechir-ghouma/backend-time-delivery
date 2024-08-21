const { LineOrder } = require('../../models');

class LineOrderService {
  async createLineOrder(lineOrderData) {
    return LineOrder.create(lineOrderData);
  }

  async getAllLineOrders() {
    return LineOrder.findAll();
  }

  async getLineOrderById(lineOrderId) {
    return LineOrder.findByPk(lineOrderId);
  }

  async deleteLineOrder(lineOrderId) {
    const lineOrder = await this.getLineOrderById(lineOrderId);
    if (!lineOrder) {
      throw new Error('Line order not found');
    }
    await LineOrder.destroy({ where: { id: lineOrderId } });
    return lineOrder;
  }
}

module.exports = new LineOrderService();
