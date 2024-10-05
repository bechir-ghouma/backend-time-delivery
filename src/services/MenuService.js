const { Menu,Category } = require('../../models');
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
    return await Menu.findByPk(id);
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
}

module.exports = new MenuService();
