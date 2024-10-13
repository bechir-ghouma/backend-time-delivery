const express = require('express');
const FavoriteController = require('../controllers/FavoriteController');
const router = express.Router();

// Route pour ajouter un restaurant aux favoris d'un utilisateur
router.post('/like', FavoriteController.likeRestaurant);

// Route pour retirer un restaurant des favoris d'un utilisateur
router.post('/unlike', FavoriteController.unlikeRestaurant);

// Route pour récupérer tous les restaurants favoris d'un utilisateur
router.get('/:userId/favorites', FavoriteController.getFavoriteRestaurants);


module.exports = router;
