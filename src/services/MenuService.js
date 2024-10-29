const { Menu,Category,User } = require('../../models');
const { Op } = require('sequelize'); 

class MenuService {
  async createMenu(data) {
    console.log(data);
    return await Menu.create(data);
  }

  async getAllMenus() {
    return await Menu.findAll();
  }

  async getMenuById(id) {
    return await Menu.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'category',
          include: [
            {
              model: User,
              as: 'restaurant',
            },
          ],
        },
      ],
    });
  }
  
  async getMenusByCategory(categoryId) {
    return await Menu.findAll({ where: { id_category: categoryId } });
  }

  async updateMenu(id, data) {
    const menu = await Menu.findByPk(id);
    if (!menu) {
      throw new Error('Menu not found');
    }
    return await menu.update(data);
  }

  async deleteMenu(id) {
    const menu = await this.getMenuById(id);
    if (!menu) {
      throw new Error('Menu not found');
    }
    menu.deleted = true;
    await menu.save();

    return menu;
  }

  async recoverMenu(id) {
    const menu = await this.getMenuById(id);
    if (!menu) {
      throw new Error('Menu not found');
    }
    menu.deleted = false;
    await menu.save();

    return menu;
  }

  async getPromotionalMenusByRestaurant(restaurantId) {
    return await Menu.findAll({
      include: {
        model: Category,
        as: 'category',
        where: { id_restaurant: restaurantId }, // Match categories for the specific restaurant
      },
      where: {
        promotion: {
          [Op.gt]: 0, // Sequelize operator to check promotion > 0
        },
        deleted: false, // Optional: Exclude deleted menus if needed
      },
    });
  }

  async searchMenusByName(searchTerm) {
    return Menu.findAll({
      include: [
        {
          model: Category,
          as: 'category',
          include: [
            {
              model: User,
              as: 'restaurant',
              attributes: ['id', 'name_restaurant'], // Inclure le nom du restaurant
            }
          ],
          attributes: ['id', 'name'], // Inclure le nom de la catégorie
        }
      ],
      where: {
        name: { [Op.like]: `%${searchTerm}%` },  // Recherche par nom de menu uniquement
        deleted: false, // Filtrer les menus non supprimés
      },
      attributes: ['id', 'name', 'description', 'image', 'price', 'promotion'], // Attributs à retourner
    });
  }

  async getRestaurantsWithPromotionalMenus() {
    try {
      // Query the database for menus with promotions
      const menus = await Menu.findAll({
        include: [{
          model: Category,
          as: 'category',
          include: [{
            model: User,
            as: 'restaurant',
            attributes: ['id', 'name_restaurant'],  // Fetch restaurant name and ID
          }],
          attributes: ['id', 'name'],  // Fetch category name and ID
        }],
        where: {
          promotion: { [Op.gt]: 0 },  // Fetch only menus with promotions
          deleted: false,  // Ensure the menu is not deleted
        },
        attributes: [],  // We only need restaurant data, so we don't fetch menu attributes
        group: ['category.id_restaurant'],  // Group by restaurant to avoid duplicates
      });

      // If no promotional menus are found, log and throw an error
      if (!menus || menus.length === 0) {
        console.log('No promotional menus found.');
        throw new Error('Menu not found');
      }

      return menus;
    } catch (error) {
      console.error('Error fetching restaurants with promotional menus:', error);
      throw error;
    }
  }
}

module.exports = new MenuService();
