const { EmergencyClosure } = require('../../models');

class EmergencyClosureService {
  async setEmergencyClosure(emergencyData, restaurantId) {
    const closure = await EmergencyClosure.findOne({ where: { restaurant_id: restaurantId } });
    if (closure) {
      return await closure.update({
        isClosed: emergencyData.isClosed,
        reason: emergencyData.reason,
        reopenDate: emergencyData.reopenDate,
      });
    } else {
      return await EmergencyClosure.create({
        isClosed: emergencyData.isClosed,
        reason: emergencyData.reason,
        reopenDate: emergencyData.reopenDate,
        restaurant_id: restaurantId,
      });
    }
  }

  async getEmergencyClosure(restaurantId) {
    return await EmergencyClosure.findOne({ where: { restaurant_id: restaurantId } });
  }
}

module.exports = new EmergencyClosureService();
