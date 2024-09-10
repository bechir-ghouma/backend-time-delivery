const userService = require('../services/userService');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const path = require('path');
const  User  = require('../../models/user');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


class UserController {
  async createUser(req, res) {
    try {
      // Log to check if the file is processed
      console.log('File received:', req.file);

      if (req.file) {
        // Check the file path
        console.log('File stored at:', req.file.path);
        req.body.image = req.file.filename; // Store the image filename in the body for saving in the database
        const path = `C:/salemketata/Freelance/DelevryFoodApp/frontend/EatTime/assets/images/${req.file.filename}`;
        const results = await cloudinary.uploader.upload(path);
        const url = cloudinary.url(results.public_id,{
          transformation: [
            {
              quality: 'auto',
              fetch_format: 'auto'
            }
          ]
        });
        req.body.image = url;
      } else {
        console.log('No file received');
      }

      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(400).json({ error: err.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
 
  async updateUser(req, res) {
    try {
      console.log('Request body:', req.body);
      console.log('File received:', req.file);
      console.log("id User:",req.params.id);
      console.log('Local time:', Date.now());
      console.log('UTC time (seconds):', Math.floor(Date.now() / 1000));
      if (req.file) {
        // Check the file path
        console.log('File stored at:', req.file.path);
        const path = `C:/salemketata/Freelance/DelevryFoodApp/frontend/EatTime/assets/images/${req.file.filename}`;
        const results = await cloudinary.uploader.upload(path, {
          timestamp: Math.floor(Date.now() / 1000),  // Generate current timestamp in seconds
        });
        const url = cloudinary.url(results.public_id,{
          transformation: [
            {
              quality: 'auto',
              fetch_format: 'auto'
            }
          ]
        });
        req.body.image = url;

      }
      
      const updatedUser = await userService.updateUser(req.params.id, {
        ...req.body,
      });
  
      res.status(200).json(updatedUser);
    } catch (err) {
      console.error('Error updating user:', err);
      res.status(400).json({ error: err.message });
    }
  }
  
  
  

  async deleteUser(req, res) {
    try {
      const user = await userService.deleteUser(req.params.id);
      res.status(200).json(user); // You can return the updated user object if you want
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  async recoverUser(req, res) {
    try {
      const user = await userService.recoverUser(req.params.id);
      res.status(200).json(user); // You can return the updated user object if you want
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  async getUsersByRole(req, res) {
    try {
      const users = await userService.getUsersByRole(req.params.role);
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new UserController();
