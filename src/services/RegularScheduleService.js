const { RegularSchedule } = require('../../models');

class RegularScheduleService {
    async updateSchedule(scheduleData, restaurantId) {
        const results = [];

        for (const [day, data] of Object.entries(scheduleData)) {
          const existingDaySchedule = await RegularSchedule.findOne({
            where: { day, restaurant_id: restaurantId },
          });
    
          if (existingDaySchedule) {
            // Update the existing schedule
            const updated = await existingDaySchedule.update({
              enabled: data.enabled,
              openTime: data.openTime,
              closeTime: data.closeTime,
            });
            results.push(updated);
          } else {
            // Create a new schedule entry if none exists
            const created = await RegularSchedule.create({
              day,
              enabled: data.enabled,
              openTime: data.openTime,
              closeTime: data.closeTime,
              restaurant_id: restaurantId,
            });
            results.push(created);
          }
        }
    
        return results;
      }

  async getSchedule(restaurantId) {
    return await RegularSchedule.findAll({ where: { restaurant_id: restaurantId } });
  }
}

module.exports = new RegularScheduleService();
