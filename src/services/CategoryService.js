const { Category,Menu,User } = require('../../models');
const { Op } = require('sequelize');

class CategoryService {
  // Créer une nouvelle catégorie
  async createCategory(data) {
    return await Category.create(data);
  }

  // Récupérer toutes les catégories
  async getAllCategories() {
    return await Category.findAll();
  }

  // Récupérer une catégorie par ID
  async getCategoryById(id) {
    return await Category.findByPk(id);
  }

  // Récupérer toutes les catégories d'un restaurant
  async getCategoriesByRestaurant(restaurantId) {
    return await Category.findAll({ where: { id_restaurant: restaurantId } });
  }

  // Mettre à jour une catégorie
  async updateCategory(id, data) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return await category.update(data);
  }

  // Supprimer une catégorie
  async deleteCategory(id) {
    const category = await this.getCategoryById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    category.deleted = true;
    await category.save();

    return category;
  }

  async recoverCategory(id) {
    const category = await this.getCategoryById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    category.deleted = false;
    await category.save();

    return category;
  }

  async getCategoriesWithMenusByRestaurant(restaurantId) {
    return await Category.findAll({
      where: { id_restaurant: restaurantId },
      include: [{
        model: Menu,
        as: 'menus', // Fetch associated menus
        where: { deleted: false }, // Fetch only active menus (optional)
        required: false, // Still fetch categories even if they don't have any menus
      }],
    });
  }

  async getRestaurantsByCategoryName(categoryName) {
    return await User.findAll({
      include: {
        model: Category,
        as: 'categories',
        where: {
          name: {
            [Op.like]: `%${categoryName}%`, // Use 'LIKE' instead of 'ILIKE' for case-insensitive matching in MariaDB
          },
        },
      },
      where: {
        role: 'Restaurant', // Ensure we only fetch restaurant users
      },
    });
  }
}

module.exports = new CategoryService();
