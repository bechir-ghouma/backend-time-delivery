const FavoriteService = require('../services/FavoriteService');

class FavoriteController {
  // Ajouter un restaurant aux favoris de l'utilisateur
  async likeRestaurant(req, res) {
    try {
      const { userId, restaurantId } = req.body;

      // Vérifier si le restaurant est déjà aimé
      const favorite = await FavoriteService.isRestaurantLiked(userId, restaurantId);

      if (favorite) {
        return res.status(400).json({ message: 'Restaurant already liked' });
      }

      // Ajouter le restaurant aux favoris
      await FavoriteService.likeRestaurant(userId, restaurantId);

      res.status(201).json({ message: 'Restaurant added to favorites' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Retirer un restaurant des favoris de l'utilisateur
  async unlikeRestaurant(req, res) {
    try {
      const { userId, restaurantId } = req.body;

      // Supprimer le restaurant des favoris
      await FavoriteService.unlikeRestaurant(userId, restaurantId);

      res.status(200).json({ message: 'Restaurant removed from favorites' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Récupérer tous les restaurants favoris d'un utilisateur
  async getFavoriteRestaurants(req, res) {
    try {
      const { userId } = req.params;

      // Récupérer les restaurants favoris
      const favoriteRestaurants = await FavoriteService.getFavoriteRestaurants(userId);

      

      res.status(200).json(favoriteRestaurants);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

}

module.exports = new FavoriteController();
