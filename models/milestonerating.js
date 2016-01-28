'use strict';
module.exports = function(sequelize, DataTypes) {
  var MilestoneRating = sequelize.define('MilestoneRating', {
    milestone_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    rating: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return MilestoneRating;
};