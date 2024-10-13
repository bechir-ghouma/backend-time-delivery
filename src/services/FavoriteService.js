const { UserFavorites, User } = require('../../models');

class FavoriteService {
  // Check if a restaurant is already liked by the user
  async isRestaurantLiked(userId, restaurantId) {
    return await UserFavorites.findOne({
      where: { userId, restaurantId },
    });
  }

  // Add a restaurant to the user's favorites
  async likeRestaurant(userId, restaurantId) {
    // Create the favorite record
    return await UserFavorites.create({ userId, restaurantId });
  }

  // Remove a restaurant from the user's favorites
  async unlikeRestaurant(userId, restaurantId) {
    return await UserFavorites.destroy({
      where: { userId, restaurantId },
    });
  }

  // Get all favorite restaurants for a user
  async getFavoriteRestaurants(userId) {
    // Retrieve user and include favorite restaurants
    const user = await User.findByPk(userId, {
      include: [{
        model: User,
        as: 'favoriteRestaurants',
        where: { role: 'Restaurant' },
        attributes: ['id', 'name_restaurant', 'address', 'image'],
      }],
    });
    
    return user ? user.favoriteRestaurants : null;
  }
}

module.exports = new FavoriteService();
