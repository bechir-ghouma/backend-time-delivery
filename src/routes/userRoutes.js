const express = require('express');
const userController = require('../controllers/userController');
const { userValidationRules, validate } = require('../validators/userValidator');
const multer = require('multer');
const path = require('path');


const router = express.Router();


// double check the destination
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


router.post('/', upload, userValidationRules(), validate, userController.createUser);


// Get all users
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Get users by role
router.get('/role/:role', userController.getUsersByRole);

// Update a user
// router.put('/:id', userValidationRules(), validate, userController.updateUser);
router.put('/:id',upload, userController.updateUser);

// Delete a user
router.delete('/:id', userController.deleteUser);

// Recover a user
router.delete('/recover/:id', userController.recoverUser);

router.post('/signin', userController.signIn);

router.get('/search/restaurants/:nameRestaurant', userController.searchRestaurants);

router.get('/restaurants/top-rated', userController.getTopRatedRestaurants);

router.post('/request-password-reset', userController.sendMailResetPassword);

router.post('/verify-token', userController.verifyToken);

router.post('/change-password', userController.changePassword);
module.exports = router;
