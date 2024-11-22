const { RegularSchedule } = require('../../models');
const { Op } = require('sequelize');

function getDatesOfCurrentWeek() {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = dimanche, 1 = lundi, ..., 6 = samedi
  const dates = [];

  // Calculer la date de lundi (début de la semaine)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDay + 1); // Lundi
  startOfWeek.setHours(0, 0, 0, 0);

  // Générer les dates de lundi à dimanche
  for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i); // Ajoute i jours
      dates.push(date.toISOString().split('T')[0]); // Formate en YYYY-MM-DD
  }

  return dates;
}


class RegularScheduleService {
  async updateSchedule(scheduleData, restaurantId) {
    const results = [];
    const datesOfWeek = getDatesOfCurrentWeek(); // Obtenir les dates de la semaine actuelle
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    for (let i = 0; i < daysOfWeek.length; i++) {
        const day = daysOfWeek[i];
        const date = datesOfWeek[i];

        // Vérifier si une entrée existe pour ce jour et cette date
        const existingDaySchedule = await RegularSchedule.findOne({
            where: {
                day,
                restaurant_id: restaurantId,
                date: { [Op.eq]: date },
            },
        });

        if (existingDaySchedule) {
            // Mettre à jour si le jour existe déjà
            const updated = await existingDaySchedule.update({
                enabled: scheduleData[day]?.enabled || false,
                openTime: scheduleData[day]?.openTime || null,
                closeTime: scheduleData[day]?.closeTime || null,
            });
            results.push(updated);
        } else {
            // Créer une nouvelle entrée pour le jour manquant
            const created = await RegularSchedule.create({
                day,
                enabled: scheduleData[day]?.enabled || false,
                openTime: scheduleData[day]?.openTime || null,
                closeTime: scheduleData[day]?.closeTime || null,
                restaurant_id: restaurantId,
                date: date, // Date système pour le jour
            });
            results.push(created);
        }
    }

    return results;
}

async getSchedule(restaurantId) {
  const datesOfWeek = getDatesOfCurrentWeek();
  return await RegularSchedule.findAll({
      where: {
          restaurant_id: restaurantId,
          date: { [Op.in]: datesOfWeek }, // Récupérer les entrées de la semaine actuelle
      },
  });
}
}

module.exports = new RegularScheduleService();
