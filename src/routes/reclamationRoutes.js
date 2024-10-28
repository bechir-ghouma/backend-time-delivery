// routes/reclamationRoutes.js

const express = require('express');
const router = express.Router();
const ReclamationController = require('../controllers/reclamationController');

// Créer une nouvelle réclamation
router.post('/',  ReclamationController.createReclamation);

// Obtenir toutes les réclamations pour un client
router.get('/:id', ReclamationController.getReclamationsByClientId);

// Mettre à jour le statut d'une réclamation
router.put('/:id/status',  ReclamationController.updateReclamationStatus);

router.delete('/:id', ReclamationController.deleteReclamation);

module.exports = router;
