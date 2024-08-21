const express = require('express');
const userController = require('../controllers/userController');
const { userValidationRules, validate } = require('../validators/userValidator');

const router = express.Router();

// Create a new user
router.post('/', userValidationRules(), validate, userController.createUser);

// Get all users
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update a user
router.put('/:id', userValidationRules(), validate, userController.updateUser);

// Delete a user
router.delete('/:id', userController.deleteUser);

module.exports = router;
