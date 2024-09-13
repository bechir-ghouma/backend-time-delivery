const { User } = require('../../models');
const bcrypt = require('bcrypt');

class UserService {
  async createUser(userData) {
    const saltRounds = 10; // You can adjust this number based on your security needs
    userData.password = await bcrypt.hash(userData.password, saltRounds);
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

  async signIn(email, password) {
    // Find the user by email and ensure the 'deleted' attribute is false
    const user = await User.findOne({ where: { email, deleted: false } });
    
    if (!user) {
      throw new Error('User not found or account has been deleted');
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Authentication successful, return the user (you might want to exclude the password field)
    const { password: _, ...userWithoutPassword } = user.dataValues;
    return userWithoutPassword;
  }
}

module.exports = new UserService();
