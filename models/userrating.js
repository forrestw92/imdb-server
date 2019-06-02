'use strict'
module.exports = (sequelize, DataTypes) => {
  const UserRating = sequelize.define(
    'UserRating',
    {
      movieID: DataTypes.STRING,
      rating: {
        type: DataTypes.INTEGER,
        validate: {
          isNumeric: { msg: 'Rating must be a integer' },
          max: {
            args: 10,
            msg: 'Rating must be 10 or less'
          },
          min: {
            args: 1,
            msg: 'Rating must be 1 or greater'
          }
        }
      },
      userID: DataTypes.INTEGER
    },
    {
      defaultScope: {
        attributes: {
          exclude: ['userID', 'id', 'movieID', 'createdAt', 'updatedAt']
        }
      }
    }
  )
  UserRating.associate = function (models) {
    UserRating.belongsTo(models.UserMovies, {
      foreignKey: 'userID',
      sourceKey: 'userID'
    })
  }
  return UserRating
}
