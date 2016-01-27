'use strict';
module.exports = function(sequelize, DataTypes) {
  var MethodRating = sequelize.define('MethodRating', {
    method_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    rating: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return MethodRating;
};