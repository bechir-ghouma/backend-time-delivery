const EmergencyClosureService = require('../services/EmergencyClosureService');

class EmergencyClosureController {
  async saveEmergencyClosure(req, res) {
    try {
      const { emergencyClosure } = req.body;
      const restaurantId = req.params.restaurantId;
      const closure = await EmergencyClosureService.setEmergencyClosure(emergencyClosure, restaurantId);
      res.status(200).json({ message: 'Emergency closure saved successfully', data: closure });
    } catch (error) {
      console.error('Error saving emergency closure:', error);
      res.status(500).json({ error: 'Failed to save emergency closure' });
    }
  }

  async getEmergencyClosure(req, res) {
    try {
      const restaurantId = req.params.restaurantId;
      const closure = await EmergencyClosureService.getEmergencyClosure(restaurantId);
      res.status(200).json(closure);
    } catch (error) {
      console.error('Error fetching emergency closure:', error);
      res.status(500).json({ error: 'Failed to fetch emergency closure' });
    }
  }
}

module.exports = new EmergencyClosureController();
