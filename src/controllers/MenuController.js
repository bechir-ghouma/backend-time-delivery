const MenuService = require('../services/MenuService');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


class MenuController {
  async createMenu(req, res) {
    try {
        console.log('File received:', req.file);

      if (req.file) {
        // Check the file path
        console.log('File stored at:', req.file.path);
        req.body.image = req.file.filename; // Store the image filename in the body for saving in the database
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
      } else {
        console.log('No file received');
      }
      const menu = await MenuService.createMenu(req.body);
      res.status(201).json(menu);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllMenus(req, res) {
    try {
      const menus = await MenuService.getAllMenus();
      res.status(200).json(menus);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getMenuById(req, res) {
    try {
      const menu = await MenuService.getMenuById(req.params.id);
      if (!menu) {
        return res.status(404).json({ message: 'Menu not found' });
      }
      res.status(200).json(menu);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getMenusByCategory(req, res) {
    try {
      const menus = await MenuService.getMenusByCategory(req.params.categoryId);
      res.status(200).json(menus);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateMenu(req, res) {
    try {
      console.log('File received:', req.file);

      if (req.file) {
        // Check the file path
        console.log('File stored at:', req.file.path);
        req.body.image = req.file.filename; // Store the image filename in the body for saving in the database
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
      } else {
        console.log('No file received');
      }
      const menu = await MenuService.updateMenu(req.params.id, req.body);
      res.status(200).json(menu);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteMenu(req, res) {
    try {
      await MenuService.deleteMenu(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async recoverMenu(req, res) {
    try {
      await MenuService.recoverMenu(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new MenuController();
