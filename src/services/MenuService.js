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
}

module.exports = new MenuService();
