const { User } = require('../../models');

class UserService {
  async createUser(userData) {
    return User.create(userData);
  }

  async getAllUsers() {
    return User.findAll();
  }

  async getUserById(userId) {
    return User.findByPk(userId);
  }

  async updateUser(userId, userData) {
    const [updated] = await User.update(userData, { where: { id: userId } });
    if (updated) {
      return this.getUserById(userId);
    }
    throw new Error('User not found');
  }

  async deleteUser(userId) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    await User.destroy({ where: { id: userId } });
    return user;
  }

  async getUsersByRole(role) {
    return User.findAll({ where: { role } });
  }
}

module.exports = new UserService();
