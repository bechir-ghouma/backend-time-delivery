const CategoryService = require('../services/CategoryService');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


class CategoryController {
  // Créer une nouvelle catégorie
  async createCategory(req, res) {
    try {
      console.log('File received:', req.file);

      if (req.file) {
        // Upload file directly to Cloudinary from buffer
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              resource_type: 'image',
              folder: 'EatTime/categories', // Optional: Specify a Cloudinary folder
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(req.file.buffer); // Pass file buffer to Cloudinary
        });

        console.log('Cloudinary upload result:', result);
        req.body.image = result.secure_url; // Store Cloudinary URL in the body
      } else {
        console.log('No file received');
      }

      const category = await CategoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ message: error.message });
    }
  }
  // Récupérer toutes les catégories
  async getAllCategories(req, res) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Récupérer une catégorie par ID
  async getCategoryById(req, res) {
    try {
      const category = await CategoryService.getCategoryById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Récupérer les catégories d'un restaurant
  async getCategoriesByRestaurant(req, res) {
    try {
      const categories = await CategoryService.getCategoriesByRestaurant(req.params.restaurantId);
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Mettre à jour une catégorie
  async updateCategory(req, res) {
    try {
      const category = await CategoryService.updateCategory(req.params.id, req.body);
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Supprimer une catégorie
  async deleteCategory(req, res) {
    try {
      await CategoryService.deleteCategory(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async recoverCategory(req, res) {
    try {
      await CategoryService.recoverCategory(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCategoriesWithMenusByRestaurant(req, res) {
    try {
      console.log("idres",req.params.restaurantId);
      const categories = await CategoryService.getCategoriesWithMenusByRestaurant(req.params.restaurantId);
      console.log("categories",categories);
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async getRestaurantsByCategoryName(req, res) {
    try {
      const { categoryName } = req.params; // Extract category name from request params
      const restaurants = await CategoryService.getRestaurantsByCategoryName(categoryName);
      res.status(200).json(restaurants);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CategoryController();
