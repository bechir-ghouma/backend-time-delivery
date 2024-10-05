'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Menus', 'promotion', {
      type: Sequelize.INTEGER,
      allowNull: true,  // Allow null values if promotion is optional
      defaultValue: 0,  // Default value is null
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Menus', 'promotion');
  }
};
