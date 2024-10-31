// services/reclamationService.js

const { Reclamation, User } = require('../../models');

const ReclamationService = {
  // Créer une nouvelle réclamation
  async createReclamation(clientId, subject, description,order_id,phone_number,name_restaurant) {
    return await Reclamation.create({ client_id: clientId, subject, description,order_id,phone_number,name_restaurant });
  },

  // Récupérer toutes les réclamations pour un client
  async getReclamationsByClientId(clientId) {
    return await Reclamation.findAll({
      where: { client_id: clientId },
      include: [{ model: User, as: 'client', attributes: ['id', 'first_name', 'last_name'] }],
    });
  },

  // Mettre à jour le statut d'une réclamation
  async updateReclamationStatus(id, status) {
    const reclamation = await Reclamation.findByPk(id);
    if (!reclamation) throw new Error('Réclamation non trouvée');
    reclamation.status = status;
    await reclamation.save();
    return reclamation;
  },

  async deleteReclamation(id) {
    const reclamation = await Reclamation.findByPk(id);
    if (!reclamation) throw new Error('Réclamation non trouvée');
    await reclamation.destroy();
    return reclamation;
  },
};

module.exports = ReclamationService;
