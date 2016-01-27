'use strict';
module.exports = function(sequelize, DataTypes) {
  var IdeaRating = sequelize.define('IdeaRating', {
    idea_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    rating: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return IdeaRating;
};