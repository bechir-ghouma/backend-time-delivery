'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('LineOrders', 'menu_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Menus',  // Fait référence à la table 'Menus'
        key: 'id',
      },
    });

    // Optionnel : supprimer l'ancienne colonne 'product'
    await queryInterface.removeColumn('LineOrders', 'product');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('LineOrders', 'product', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Supprimer la colonne 'menu_id'
    await queryInterface.removeColumn('LineOrders', 'menu_id');
  }
};
