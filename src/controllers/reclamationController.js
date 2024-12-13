// controllers/reclamationController.js

const ReclamationService = require('../services/reclamationService');

const ReclamationController = {

  async getAllReclamations(req, res) {
    try {
      const reclamations = await ReclamationService.getAllReclamations();
      res.status(200).json(reclamations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Créer une nouvelle réclamation
  async createReclamation(req, res) {
    try {
      const { subject, description, clientId,order_id,phone_number,name_restaurant } = req.body;
      const reclamation = await ReclamationService.createReclamation(clientId, subject, description,order_id,phone_number,name_restaurant);
      res.status(201).json(reclamation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtenir toutes les réclamations pour un client
  async getReclamationsByClientId(req, res) {
    try {
      const { id } = req.params;
      const reclamations = await ReclamationService.getReclamationsByClientId(id);
      res.json(reclamations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateReclamationStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedReclamation = await ReclamationService.updateReclamationStatus(id, status);
      res.json(updatedReclamation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Supprimer une réclamation
  async deleteReclamation(req, res) {
    try {
      const { id } = req.params;
      const deletedReclamation = await ReclamationService.deleteReclamation(id);
      res.json(deletedReclamation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  
};

module.exports = ReclamationController;
