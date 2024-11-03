const RegularScheduleService = require('../services/RegularScheduleService');

class RegularScheduleController {
    async updateSchedule(req, res) {
        try {
          const { scheduleData } = req.body;
          const restaurantId = req.params.restaurantId;
          const results = await RegularScheduleService.updateSchedule(scheduleData, restaurantId);
          res.status(200).json({ message: 'Schedule updated successfully', data: results });
        } catch (error) {
          console.error('Error updating schedule:', error);
          res.status(500).json({ error: 'Failed to update schedule' });
        }
      }

  async getSchedule(req, res) {
    try {
      const restaurantId = req.params.restaurantId;
      const schedule = await RegularScheduleService.getSchedule(restaurantId);
      res.status(200).json(schedule);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      res.status(500).json({ error: 'Failed to fetch schedule' });
    }
  }
}

module.exports = new RegularScheduleController();
