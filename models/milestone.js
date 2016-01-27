module.exports = function(sequelize, DataTypes) {
  return sequelize.define("Milestone", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    date: DataTypes.DATE,
    milestone: DataTypes.STRING,
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
  })
}
