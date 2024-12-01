const express = require('express');
const CategoryController = require('../controllers/CategoryController');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
}).single('image');

// Route for creating a category
router.post('/', upload, CategoryController.createCategory);
// Route pour récupérer toutes les catégories
router.get('/', CategoryController.getAllCategories);

// Route pour récupérer une catégorie par ID
router.get('/:id', CategoryController.getCategoryById);

// Route pour récupérer les catégories d'un restaurant
router.get('/restaurant/:restaurantId', CategoryController.getCategoriesByRestaurant);

router.get('/restaurant/:restaurantId/with-menus', CategoryController.getCategoriesWithMenusByRestaurant);
router.get('/restaurants/category/:categoryName', CategoryController.getRestaurantsByCategoryName);


// Route pour mettre à jour une catégorie
router.put('/:id', CategoryController.updateCategory);

// Route pour supprimer une catégorie
router.delete('/:id', CategoryController.deleteCategory);

router.delete('/recover/:id', CategoryController.recoverCategory);

module.exports = router;
