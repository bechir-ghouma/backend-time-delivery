const express = require('express');
const MenuController = require('../controllers/MenuController');
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
router.post('/', upload,MenuController.createMenu);
router.get('/', MenuController.getAllMenus);
router.get('/:id', MenuController.getMenuById);
router.get('/category/:categoryId', MenuController.getMenusByCategory);
router.put('/:id', MenuController.updateMenu);
router.delete('/:id', MenuController.deleteMenu);

module.exports = router;
