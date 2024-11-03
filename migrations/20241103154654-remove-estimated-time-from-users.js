'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'estimated_time');

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'estimated_time', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
