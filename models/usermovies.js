'use strict'
module.exports = (sequelize, DataTypes) => {
  const UserMovies = sequelize.define(
    'UserMovies',
    {
      userID: DataTypes.INTEGER,
      movieID: { type: DataTypes.STRING, allowNull: false }
    },
    {
      defaultScope: {
        attributes: { exclude: ['id', 'userID', 'movieID', 'updatedAt'] }
      }
    }
  )
  UserMovies.associate = function (models) {
    UserMovies.belongsTo(models.Movies, {
      foreignKey: 'movieID',
      sourceKey: 'movieID'
    })
    UserMovies.hasOne(models.UserRating, {
      foreignKey: 'userID',
      sourceKey: 'userID'
    })
    UserMovies.belongsTo(models.Users, {
      foreignKey: 'userID',
      targetKey: 'id'
    })
  }
  return UserMovies
}
