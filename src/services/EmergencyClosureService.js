const { EmergencyClosure } = require('../../models');
const { parseISO, isAfter,parse } = require('date-fns'); // Import des fonctions nécessaires

class EmergencyClosureService {
  async setEmergencyClosure(emergencyData, restaurantId) {
    const systemDate = new Date().toISOString().split('T')[0]; // Date système (YYYY-MM-DD)

    // Récupérer la dernière entrée pour ce restaurant
    const lastClosure = await EmergencyClosure.findOne({
      where: { restaurant_id: restaurantId },
      order: [['date', 'DESC']], // Trier par date décroissante pour obtenir la dernière entrée
    });

    if (lastClosure) {
      const reopenDate = lastClosure.reopenDate ? new Date(lastClosure.reopenDate) : null;

      if (reopenDate && reopenDate >= new Date(systemDate) && !emergencyData.isClosed) {
        // Cas : `reopenDate` >= `systemDate` et `isClosed` est false
        // Mise à jour de la dernière ligne
        return await lastClosure.update({
          isClosed: emergencyData.isClosed,
          reason: emergencyData.reason,
          reopenDate: emergencyData.reopenDate,
          date: systemDate, // Mettre à jour la date avec la date système
        });
      }
    }

    // Cas : Créer une nouvelle ligne si aucune mise à jour n'a été faite
    return await EmergencyClosure.create({
      isClosed: emergencyData.isClosed,
      reason: emergencyData.reason,
      reopenDate: emergencyData.reopenDate,
      restaurant_id: restaurantId,
      date: systemDate, // Utilise la date système pour la nouvelle ligne
    });
  }


  async getEmergencyClosure(restaurantId) {
    const systemDate = new Date(); // Date système (objet Date)

    // Récupérer la dernière entrée pour le restaurant
    const lastClosure = await EmergencyClosure.findOne({
      where: { restaurant_id: restaurantId },
      order: [['date', 'DESC']], // Trier par date décroissante
    });

    if (lastClosure) {
      // Vérifiez et manipulez reopenDate
      const reopenDate = lastClosure.reopenDate ? new Date(lastClosure.reopenDate) : null;

      console.log('Raw reopenDate:', lastClosure.reopenDate); // Affiche la valeur brute
      console.log('Parsed reopenDate:', reopenDate); 
      console.log('Parsed systemDate:', systemDate);// Affiche la valeur parsée

      // Si reopenDate dépasse la date système, retourner un objet vide
      if (reopenDate && isAfter(reopenDate, systemDate)) {
        return lastClosure;
        
      }
      return {}; // Objet vide si la réouverture est dans le futur
      // Sinon, retourner la dernière ligne
      
    }

    return {}; // Si aucune entrée n'existe
  }



}

module.exports = new EmergencyClosureService();
