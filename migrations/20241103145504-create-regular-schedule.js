// migrations/[timestamp]-create-regular-schedule.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RegularSchedules', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      day: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      openTime: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      closeTime: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      restaurant_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('RegularSchedules');
  }
};
