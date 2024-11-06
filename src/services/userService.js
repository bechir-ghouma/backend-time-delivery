const { User } = require('../../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Utilisez votre service e-mail (ex. SendGrid, Mailgun, etc.)
  auth: {
      user: 'ketatasalem7@gmail.com', // Remplacez par votre e-mail
      pass: 'ahan ygra ovgf tvtx' // Mot de passe de l'application
  }
});

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

  async sendPasswordResetEmail(email, verificationCode) {
    try {
        await transporter.sendMail({
            from: 'ketatasalem7@gmail.com',
            to: email,
            subject: 'Code de réinitialisation de mot de passe',
            text: `Votre code de réinitialisation de mot de passe est : ${verificationCode}. Ce code est valable pour 10 minutes.`,
            html: `<p>Votre code de réinitialisation de mot de passe est : <b>${verificationCode}</b></p><p>Ce code est valable pour 10 minutes.</p>`
        });
        console.log('E-mail de réinitialisation envoyé');
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail de réinitialisation:', error); // Full error log
        throw new Error(`Impossible d'envoyer l'e-mail de réinitialisation: ${error.message}`);
    }
};


  async resetPasswordSendingMail(email){
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Utilisateur non trouvé');
  }

    // Générer un code de vérification et une date d'expiration
    const verificationCode =  Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // expiration dans 10 minutes

    // Enregistrer le code et l'expiration
    user.verificationCode = verificationCode;
    user.verificationCodeExpiresAt = expiresAt;
    await user.save();

    // Envoyer l'e-mail avec le code
    try {
      await this.sendPasswordResetEmail(email, verificationCode);
              console.log('Un code de réinitialisation a été envoyé à votre adresse e-mail.');
    } catch (error) {
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
}

module.exports = new UserService();
