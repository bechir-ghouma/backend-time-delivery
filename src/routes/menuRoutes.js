const express = require('express');
const MenuController = require('../controllers/MenuController');
const multer = require('multer');
const path = require('path');
const router = express.Router();
// Use multer's memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
}).single('image');

// Routes for menu management
router.post('/', upload, MenuController.createMenu);
router.put('/:id', upload, MenuController.updateMenu);
router.get('/', MenuController.getAllMenus);
router.get('/:id', MenuController.getMenuById);
router.get('/category/:categoryId', MenuController.getMenusByCategory);
router.get('/restaurant/:restaurantId/promotions', MenuController.getPromotionalMenusByRestaurant);
router.delete('/:id', MenuController.deleteMenu);
router.delete('/recover/:id', MenuController.recoverMenu);
router.get('/restaurantsWithPromotions', MenuController.getRestaurantsWithPromotionalMenus);
router.get('/search/:searchTerm', MenuController.searchMenus);

module.exports = router;
