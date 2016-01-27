if (!global.hasOwnProperty('db')) {
  var Sequelize = require('sequelize')
    , sequelize = null

  var match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]*)@([^:]+):(\d+)\/(.+)/)
  sequelize = new Sequelize(match[5], match[1], match[2], {
    dialect:  'postgres',
    protocol: 'postgres',
    port:     match[4],
    host:     match[3],
    logging: false,
    dialectOptions: {
      ssl: (process.env.HOST == 'http://localhost:3000') ? false : true
    }
  });

  global.db = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    User: sequelize.import(__dirname + '/user'),
    Idea: sequelize.import(__dirname + '/idea'),
    Method: sequelize.import(__dirname + '/method'),
    Milestone: sequelize.import(__dirname + '/milestone'),
    IdeaRating: sequelize.import(__dirname + '/idearating'),
    MethodRating: sequelize.import(__dirname + '/methodrating'),
    MilestoneRating: sequelize.import(__dirname + '/milestonerating')
    // add your other models here
  }

  /*
    Associations can be defined here. E.g. like this:
    global.db.User.hasMany(global.db.SomethingElse)
  */
  global.db.User.hasMany(global.db.Idea);
  global.db.User.hasMany(global.db.Method);
  global.db.User.hasMany(global.db.Milestone);
  global.db.Idea.hasMany(global.db.IdeaRating);
  global.db.Method.hasMany(global.db.MethodRating);
  global.db.Milestone.hasMany(global.db.MilestoneRating);
  global.db.User.hasMany(global.db.IdeaRating);
  global.db.User.hasMany(global.db.MethodRating);
  global.db.User.hasMany(global.db.MilestoneRating);
}

module.exports = global.db
