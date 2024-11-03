const express = require('express');
const RegularScheduleController = require('../controllers/RegularScheduleController');
const EmergencyClosureController = require('../controllers/EmergencyClosureController');

const router = express.Router();

// Regular Schedule Routes
router.put('/restaurant/:restaurantId/regular-schedule', RegularScheduleController.updateSchedule);
router.get('/restaurant/:restaurantId/regular-schedule', RegularScheduleController.getSchedule);

// Emergency Closure Routes
router.post('/restaurant/:restaurantId/emergency-closure', EmergencyClosureController.saveEmergencyClosure);
router.get('/restaurant/:restaurantId/emergency-closure', EmergencyClosureController.getEmergencyClosure);

module.exports = router;
