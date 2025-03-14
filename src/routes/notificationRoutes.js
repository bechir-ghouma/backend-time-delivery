const express = require('express');
const router = express.Router();
const { User } = require('../../models');
const notificationService = require('../services/notificationService');

// Register push notification token
router.post('/register-token', async (req, res) => {
  const { userId, token, userType } = req.body;
  
  try {
    // Find the user
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update the user's push token
    user.push_token = token;
    await user.save();
    
    console.log(`Push token registered for user ${userId} (${userType}): ${token}`);
    
    return res.status(200).json({ success: true, message: 'Push token registered successfully' });
  } catch (error) {
    console.error('Error registering push token:', error);
    return res.status(500).json({ error: 'Failed to register push token' });
  }
});

// Remove push notification token
router.post('/remove-token', async (req, res) => {
  const { userId, token } = req.body;
  
  try {
    // Find the user
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Only remove if the current token matches
    if (user.push_token === token) {
      user.push_token = null;
      await user.save();
      console.log(`Push token removed for user ${userId}`);
    }
    
    return res.status(200).json({ success: true, message: 'Push token removed successfully' });
  } catch (error) {
    console.error('Error removing push token:', error);
    return res.status(500).json({ error: 'Failed to remove push token' });
  }
});

// Test push notification (for development)
router.post('/test', async (req, res) => {
  const { token, title, body } = req.body;
  
  try {
    const result = await notificationService.sendPushNotification(
      token,
      title || 'Test Notification',
      body || 'This is a test notification',
      { type: 'TEST_NOTIFICATION', data: 'Additional test data' }
    );
    
    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Error sending test notification:', error);
    return res.status(500).json({ error: 'Failed to send test notification' });
  }
});

module.exports = router;