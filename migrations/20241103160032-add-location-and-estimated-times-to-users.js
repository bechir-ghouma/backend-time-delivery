'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'latitude', {
      type: Sequelize.DECIMAL(15, 10),
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'longitude', {
      type: Sequelize.DECIMAL(15, 10),
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'min_estimated_time', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'max_estimated_time', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'latitude');
    await queryInterface.removeColumn('Users', 'longitude');
    await queryInterface.removeColumn('Users', 'min_estimated_time');
    await queryInterface.removeColumn('Users', 'max_estimated_time');
  }
};
