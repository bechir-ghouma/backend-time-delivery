const express = require('express');
const CategoryController = require('../controllers/CategoryController');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destPath = path.join('C:', 'salemketata', 'Freelance', 'DelevryFoodApp', 'frontend', 'EatTime', 'assets', 'images');
        console.log('Destination Path:', destPath); // Log to verify
        cb(null, destPath);

    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase(); // Ensure correct file extension
        cb(null, uniqueSuffix + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
}).single('image');


// Route pour créer une catégorie
router.post('/',upload,CategoryController.createCategory);

// Route pour récupérer toutes les catégories
router.get('/', CategoryController.getAllCategories);

// Route pour récupérer une catégorie par ID
router.get('/:id', CategoryController.getCategoryById);

// Route pour récupérer les catégories d'un restaurant
router.get('/restaurant/:restaurantId', CategoryController.getCategoriesByRestaurant);

// Route pour mettre à jour une catégorie
router.put('/:id', CategoryController.updateCategory);

// Route pour supprimer une catégorie
router.delete('/:id', CategoryController.deleteCategory);

router.delete('/recover/:id', CategoryController.recoverCategory);

module.exports = router;
