module.exports = function(sequelize, DataTypes) {
  return sequelize.define("Idea", {
    id: { type: DataTypes.INTEGER, autoIncrement: true },
    idea: DataTypes.STRING,
    blurb: DataTypes.TEXT,
    success_metrics: DataTypes.TEXT,
    user_id: {
      type: DataTypes.INTEGER,
      references: {
       // This is a reference to another model
       model: User,
       // This is the column name of the referenced model
       key: 'id',
       // This declares when to check the foreign key constraint. PostgreSQL only.
       deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    }
  }
)}
