'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'tarif_livraison', {
      type: Sequelize.FLOAT,
      allowNull: true, // Optionnel selon vos besoins
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'tarif_livraison');

  }
};
