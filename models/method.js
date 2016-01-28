'use strict';
module.exports = function(sequelize, DataTypes) {
  var Method = sequelize.define('Method', {
    label: DataTypes.STRING,
    tool: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Method;
};