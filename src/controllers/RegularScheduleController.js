const RegularScheduleService = require('../services/RegularScheduleService');

class RegularScheduleController {
    async updateSchedule(req, res) {
        try {
          const { scheduleData } = req.body;
          console.log("scheduleData",scheduleData);
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

  async updateScheduleRestaurant(req, res) {
    try {
      const { scheduleData } = req.body;
      console.log("scheduleData",scheduleData);
      const restaurantId = req.params.restaurantId;
      const results = await RegularScheduleService.updateScheduleRestaurant(scheduleData, restaurantId);
      res.status(200).json({ message: 'Schedule updated successfully', data: results });
    } catch (error) {
      console.error('Error updating schedule:', error);
      res.status(500).json({ error: 'Failed to update schedule' });
    }
  }

async getScheduleRestaurant(req, res) {
try {
  const restaurantId = req.params.restaurantId;
  const schedule = await RegularScheduleService.getScheduleRestaurant(restaurantId);
  res.status(200).json(schedule);
} catch (error) {
  console.error('Error fetching schedule:', error);
  res.status(500).json({ error: 'Failed to fetch schedule' });
}
}

async getScheduleLivreur(req, res) {
  try {
    const restaurantId = req.params.restaurantId;
    const schedule = await RegularScheduleService.getScheduleLivreur(restaurantId);
    res.status(200).json(schedule);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
  }

async updateScheduleLivreur(req, res) {
  try {
    const { scheduleData } = req.body;
    console.log("scheduleData",scheduleData);
    const restaurantId = req.params.restaurantId;
    const results = await RegularScheduleService.updateScheduleForNextWeekLivreur(scheduleData, restaurantId);
    res.status(200).json({ message: 'Schedule updated successfully', data: results });
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ error: 'Failed to update schedule' });
  }
}

}

module.exports = new RegularScheduleController();
