'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'name_client', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Modifier la colonne 'client_id' pour permettre les valeurs NULL
    await queryInterface.changeColumn('Orders', 'client_id', {
      type: Sequelize.INTEGER,
      allowNull: true,  // Permet maintenant les valeurs nulles
      references: {
        model: 'Users',
        key: 'id',
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'name_client');

    // Revenir à l'état initial : remettre 'client_id' à NOT NULL
    await queryInterface.changeColumn('Orders', 'client_id', {
      type: Sequelize.INTEGER,
      allowNull: false,  // Remettre l'ancienne contrainte
      references: {
        model: 'Users',
        key: 'id',
      },
    });
  }
};
