const { RegularSchedule } = require('../../models');
const { Op } = require('sequelize');

function getDatesOfCurrentWeek() {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = dimanche, 1 = lundi, ..., 6 = samedi
    const dates = [];

    // Calculer le début de la semaine (lundi local)
    const startOfWeek = new Date(today);
    const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1; // Si dimanche (0), remonter de 6 jours
    startOfWeek.setDate(today.getDate() - daysSinceMonday);
    startOfWeek.setHours(0, 0, 0, 0); // Réinitialiser les heures

    // Générer les dates de lundi à dimanche (7 jours)
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i); // Ajoute i jours
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // Ajuste pour fuseau horaire local
        dates.push(localDate.toISOString().split('T')[0]); // Formate en YYYY-MM-DD
    }

    return dates;
}



function getDatesOfNextWeek() {
    const today = new Date();
    const dates = [];

    // Commencer au lendemain
    const startOfNextWeek = new Date(today);
    startOfNextWeek.setDate(today.getDate() + 1); // +1 pour commencer demain
    startOfNextWeek.setHours(0, 0, 0, 0);

    // Générer les dates jusqu'à dimanche prochain
    for (let i = 1; i < 8; i++) {
        const date = new Date(startOfNextWeek.getTime()); // Créer une copie
        date.setDate(startOfNextWeek.getDate() + i); // Ajoute i jours
        dates.push(date.toISOString().split('T')[0]); // Formate en YYYY-MM-DD
    }

    return dates;
}



class RegularScheduleService {
    async updateSchedule(scheduleData, restaurantId) {
        const results = [];
        const datesOfWeek = getDatesOfCurrentWeek(); // Retrieve the dates of the current week
        const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
        for (let i = 0; i < daysOfWeek.length; i++) {
            const day = daysOfWeek[i];
            const date = datesOfWeek[i];
    
            // Find the corresponding schedule data for the current day
            const daySchedule = scheduleData.find((entry) => entry.day.toLowerCase() === day);
    
            const existingDaySchedule = await RegularSchedule.findOne({
                where: {
                    day,
                    restaurant_id: restaurantId,
                    date: { [Op.eq]: date },
                },
            });
    
            if (existingDaySchedule) {
                // Update if the day already exists
                const updated = await existingDaySchedule.update({
                    enabled: daySchedule?.enabled || false,
                    openTime: daySchedule?.openTime || null,
                    closeTime: daySchedule?.closeTime || null,
                });
                results.push(updated);
            } else {
                // Create a new entry for the missing day
                const created = await RegularSchedule.create({
                    day,
                    enabled: daySchedule?.enabled || false,
                    openTime: daySchedule?.openTime || null,
                    closeTime: daySchedule?.closeTime || null,
                    restaurant_id: restaurantId,
                    date: date, // System date for the day
                });
                results.push(created);
            }
        }
    
        return results;
    }
    

async  updateScheduleForNextWeekLivreur(scheduleData, restaurantId) {
    const results = [];
    const datesOfNextWeek = getDatesOfNextWeek(); // Obtenir les dates de la semaine suivante
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    for (let i = 0; i < daysOfWeek.length; i++) {
        const day = daysOfWeek[i];
        const date = datesOfNextWeek[i];

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
                date: date, // Date de la semaine suivante
            });
            results.push(created);
        }
    }

    return results;
}


async getSchedule(restaurantId) {
  const datesOfWeek = getDatesOfCurrentWeek();
  console.log('datesOfWeek',datesOfWeek);
  return await RegularSchedule.findAll({
      where: {
          restaurant_id: restaurantId,
          date: { [Op.in]: datesOfWeek }, // Récupérer les entrées de la semaine actuelle
      },
  });
}

async getScheduleLivreur(restaurantId) {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = dimanche, 1 = lundi, ..., 6 = samedi
    let datesOfWeek;
  
    if (currentDay === 0) { // Dimanche
        datesOfWeek = getDatesOfNextWeek(); // Récupérer les dates de la semaine suivante
    } else {
        datesOfWeek = getDatesOfCurrentWeek(); // Récupérer les dates de la semaine actuelle
        console.log(datesOfWeek);

    }
  
    return await RegularSchedule.findAll({
        where: {
            restaurant_id: restaurantId,
            date: { [Op.in]: datesOfWeek },
        },
    });
  }

async updateScheduleRestaurant(scheduleData, restaurantId) {
    const results = [];

    for (const [day, data] of Object.entries(scheduleData)) {
      const existingDaySchedule = await RegularSchedule.findOne({
        where: { day, restaurant_id: restaurantId },
      });

      if (existingDaySchedule) {
        // Update the existing schedule
        const updated = await existingDaySchedule.update({
          enabled: data.enabled,
          openTime: data.openTime,
          closeTime: data.closeTime,
        });
        results.push(updated);
      } else {
        // Create a new schedule entry if none exists
        const created = await RegularSchedule.create({
          day,
          enabled: data.enabled,
          openTime: data.openTime,
          closeTime: data.closeTime,
          restaurant_id: restaurantId,
        });
        results.push(created);
      }
    }

    return results;
  }

async getScheduleRestaurant(restaurantId) {
return await RegularSchedule.findAll({ where: { restaurant_id: restaurantId } });
}

}

module.exports = new RegularScheduleService();
