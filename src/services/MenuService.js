const { Menu } = require('../../models');

class MenuService {
  async createMenu(data) {
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
    const menu = await Menu.findByPk(id);
    if (!menu) {
      throw new Error('Menu not found');
    }
    return await menu.destroy();
  }
}

module.exports = new MenuService();
