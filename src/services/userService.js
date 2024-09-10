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
    // Perform the update and ignore the number of affected rows
    await User.update(userData, { where: { id: userId } });
    
    // Fetch the updated user (or the same user if no changes)
    const updatedUser = await this.getUserById(userId);
    
    if (updatedUser) {
      return updatedUser;
    }
  
    throw new Error('User not found');
  }
  
  


  async deleteUser(userId) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Instead of deleting, set the 'deleted' attribute to true
    user.deleted = true;
    await user.save();

    return user;
  }

  async recoverUser(userId) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Instead of deleting, set the 'deleted' attribute to true
    user.deleted = false;
    await user.save();

    return user;
  }

  async getUsersByRole(role) {
    return User.findAll({ where: { role } });
  }
}

module.exports = new UserService();
