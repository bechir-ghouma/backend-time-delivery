const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/RatingController');

// Route to add/update a rating
router.post('/', ratingController.addOrUpdateRating);

// Route to get the average rating for a restaurant
router.get('/restaurants/:restaurantId/average-rating', ratingController.getAverageRating);

router.post('/getRestaurantRatingWithUserRating', ratingController.getRestaurantRatingWithUserRating);

module.exports = router;