const { User,Category,Menu } = require('../../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const emailService = require('./emailService');
const RegularScheduleService = require('./RegularScheduleService');
const EmergencyClosureService = require('./EmergencyClosureService');

class UserService {
  async createUser(userData) {
    const saltRounds = 10; // You can adjust this number based on your security needs
    userData.password = await bcrypt.hash(userData.password, saltRounds);
    const user = await User.create(userData);
    
    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(user.email, user.first_name);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't throw error here as user creation was successful
    }
    
    return user;
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
    // Récupérer les utilisateurs par rôle
    const users = await User.findAll({ where: { role } });

    // Si le rôle est 'Restaurant', ajouter les schedules réguliers et urgences
    if (role === 'Restaurant' ) {
      for (const user of users) {
        const restaurantId = user.id;

        // Récupérer le schedule régulier
        const regularSchedule = await RegularScheduleService.getScheduleRestaurant(restaurantId);

        // Récupérer le schedule d'urgence
        const emergencyClosure = await EmergencyClosureService.getEmergencyClosure(restaurantId);

        // Ajouter les schedules aux données utilisateur
        user.dataValues.regularSchedule = regularSchedule;
        user.dataValues.emergencyClosure = emergencyClosure;
      }
    }
    else if(role === 'Livreur'){
      for (const user of users) {
        const restaurantId = user.id;

        // Récupérer le schedule régulier
        const regularSchedule = await RegularScheduleService.getSchedule(restaurantId);

        // Ajouter les schedules aux données utilisateur
        user.dataValues.regularSchedule = regularSchedule;
    }

    }

    return users;
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

  async searchRestaurantsByName(nameRestaurant) {
    return User.findAll({
      where: {
        name_restaurant: {
          [Op.like]: `%${nameRestaurant}%`,  // Utilisation de Op.like pour la recherche partielle
        },
        role: 'Restaurant',  // Filtrer uniquement les utilisateurs ayant le rôle 'Restaurant'
        deleted: false,      // Exclure les restaurants supprimés si nécessaire
      },
    });
  }

  async getTopRatedRestaurants() {
    return User.findAll({
      where: {
        role: 'Restaurant',  // Only fetch users with the role 'Restaurant'
        average_raiting: {    // Filter restaurants with an average rating of 4 or above
          [Op.gte]: 4
        },
        deleted: false,       // Ensure the restaurant is not marked as deleted
      },
      attributes: ['id', 'name_restaurant', 'address', 'average_raiting', 'image'], // Return necessary attributes
    });
  }

  async resetPasswordSendingMail(email){
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Générer un code de vérification et une date d'expiration
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // expiration dans 10 minutes

    // Enregistrer le code et l'expiration
    user.verificationCode = verificationCode;
    user.verificationCodeExpiresAt = expiresAt;
    await user.save();

    // Envoyer l'e-mail avec le code
    try {
      await emailService.sendPasswordResetEmail(email, verificationCode);
      console.log('Un code de réinitialisation a été envoyé à votre adresse e-mail.');
      return { message: 'Un code de réinitialisation a été envoyé à votre adresse e-mail.' };
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail de réinitialisation:', error);
      throw new Error('Erreur lors de l\'envoi de l\'e-mail de réinitialisation');
    }
  }

  async verifyToken(email, verificationCode) {
    const user = await User.findOne({ where: { email, verificationCode } });
    if (!user) {
      throw new Error('Code de vérification incorrect ou utilisateur non trouvé');
    }

    // Check if the current time is greater than the expiration time
    if (Date.now() > user.verificationCodeExpiresAt) {
      throw new Error('Le code de vérification a expiré');
    }

    // Token is valid and not expired
    return { message: 'Code de vérification valide' };
  }

  async changePassword(email, newPassword) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password
    user.password = hashedPassword;
    
    // Clear verification code after successful password change
    user.verificationCode = null;
    user.verificationCodeExpiresAt = null;
    
    await user.save();

    return { message: 'Mot de passe mis à jour avec succès' };
  }

  async updateTarifRestaurant(userId, newTarif) {
    const user = await this.getUserById(userId);
    if (!user || user.role !== 'Restaurant') {
      throw new Error("Restaurant non trouvé ou l'utilisateur n'a pas le rôle 'Restaurant'");
    }

    user.tarif_restaurant = newTarif;
    await user.save();

    return user; // retourne l'utilisateur mis à jour
  }

  async getRestaurantsWithPromotions() {
    const usersWithPromotions = await User.findAll({
      where: {
        role: 'Restaurant',
        deleted: false, // Exclure les restaurants supprimés
      },
      include: [
        {
          model: Category,
          as: 'categories',
          required: true,
          include: [
            {
              model: Menu,
              as: 'menus',
              required: true,
              where: {
                promotion: { [Op.gt]: 0 }, // Vérifie que la promotion est supérieure à 0
              },
            },
          ],
        },
      ],
    });
  
    return usersWithPromotions;
  }
}

module.exports = new UserService();