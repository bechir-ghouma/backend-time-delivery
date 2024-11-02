const { Rating,sequelize  } = require('../../models');

class RatingService {
  // Add or update a rating for a restaurant
  async addOrUpdateRating(userId, restaurantId, ratingValue) {
    const existingRating = await Rating.findOne({
      where: { userId, restaurantId },
    });

    if (existingRating) {
      existingRating.rating = ratingValue;
      await existingRating.save();
      return { message: 'Rating updated successfully' };
    } else {
      await Rating.create({ userId, restaurantId, rating: ratingValue });
      return { message: 'Rating added successfully' };
    }
  }

  // Get average rating for a restaurant
  async getAverageRating(restaurantId) {
    const ratings = await Rating.findAll({
      where: { restaurantId },
      attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']],
    });

    const avgRating = ratings[0].get('avgRating');
    return { restaurantId, averageRating: parseFloat(avgRating).toFixed(2) };
  }

  async getRestaurantRatingWithUserRating(restaurantId, userId) {
    // Fetch average rating for the restaurant
    const ratings = await Rating.findAll({
      where: { restaurantId },
      attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']],
    });
    const avgRating = parseFloat(ratings[0].get('avgRating')).toFixed(2);

    // Fetch user's specific rating for the restaurant
    const userRating = await Rating.findOne({
      where: { restaurantId, userId },
      attributes: ['rating'],
    });

    // Get user's rating if available, otherwise set to null
    const userSpecificRating = userRating ? userRating.get('rating') : null;

    return { 
      restaurantId, 
      averageRating: avgRating, 
      userRating: userSpecificRating 
    };
  }
}

module.exports = new RatingService();
