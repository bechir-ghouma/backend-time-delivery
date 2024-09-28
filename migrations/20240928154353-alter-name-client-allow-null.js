'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.changeColumn('Orders', 'name_client', {
      type: Sequelize.STRING,
      allowNull: true,  // Set allowNull to true
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.changeColumn('Orders', 'name_client', {
      type: Sequelize.STRING,
      allowNull: false,  // Revert the change in case of rollback
    });
  }
};
