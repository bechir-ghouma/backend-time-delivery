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
        const path = `C:/Users/Dell/OneDrive/Bureau/eat11.16/frontend/EatTime/assets/images/${req.file.filename}`;
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

  async signIn(req, res) {
    try {
      const { email, password } = req.body;

      const user = await userService.signIn(email, password);

      res.json(user);
    } catch (err) {
      console.error('Error during sign-in:', err);
      res.status(400).json({ error: err.message });
    }
  }

  async searchRestaurants(req, res) {
    try {
      const { nameRestaurant } = req.params; // Récupérer le nom du restaurant depuis req.params
      if (!nameRestaurant) {
        return res.status(400).json({ error: 'Restaurant name is required' });
      }

      const restaurants = await userService.searchRestaurantsByName(nameRestaurant);
      res.status(200).json(restaurants);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getTopRatedRestaurants(req, res) {
    try {
      const restaurants = await userService.getTopRatedRestaurants();
      res.status(200).json(restaurants);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async sendMailResetPassword(req,res){
    try {
      const { email } = req.body;
      const reset = await userService.resetPasswordSendingMail(email);
      res.json(reset);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async verifyToken(req, res) {
    const { email, verificationCode } = req.body;

    try {
      const result = await userService.verifyToken(email, verificationCode);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async changePassword(req, res) {
    const { email, newPassword } = req.body;

    try {
      const result = await userService.changePassword(email, newPassword);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async  updateRestaurantTarif(req, res) {
    try {
      const {newTarif } = req.body; // Assurez-vous que `userId` et `newTarif` sont transmis dans la requête
      const updatedUser = await userService.updateTarifRestaurant(req.params.userId, newTarif);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
