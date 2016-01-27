'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      name: Sequelize.STRING,
      email: Sequelize.STRING
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};
