'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Reclamations', 'name_restaurant', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Reclamations', 'phone_number', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Reclamations', 'order_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Orders',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Reclamations', 'name_restaurant');
    await queryInterface.removeColumn('Reclamations', 'phone_number');
    await queryInterface.removeColumn('Reclamations', 'order_id');
  }
};
