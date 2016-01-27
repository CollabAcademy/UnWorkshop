'use strict';
module.exports = function(sequelize, DataTypes) {
  var Idea = sequelize.define('Idea', {
    title: DataTypes.STRING,
    blurb: DataTypes.TEXT,
    success_metric: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Idea;
};