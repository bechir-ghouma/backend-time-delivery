'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'image', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'deleted', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false // Providing a default value can help avoid issues with existing records.
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'image');
    await queryInterface.removeColumn('Users', 'deleted');
  }
};
