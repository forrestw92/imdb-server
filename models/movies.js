'use strict'
module.exports = (sequelize, DataTypes) => {
  const Movies = sequelize.define(
    'Movies',
    {
      name: {
        type: DataTypes.STRING,
        validate: { notEmpty: { msg: 'Movie must have a valid name' } }
      },
      poster: {
        type: DataTypes.STRING,
        validate: {
          isUrl: { msg: 'Poster must be a valid url' },
          isImage (val) {
            if (val.match(/\.(jpeg|jpg|gif|png)$/) === null) {
              throw new Error('Thumbnail is not a valid image url')
            }
          }
        }
      },
      thumbnail: {
        type: DataTypes.STRING,
        validate: {
          isUrl: { msg: 'Thumbnail must be a valid url' },
          isImage (val) {
            if (val.match(/\.(jpeg|jpg|gif|png)$/) === null) {
              throw new Error('Thumbnail is not a valid image url')
            }
          }
        }
      },
      movieID: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true
      },
      year: {
        type: DataTypes.INTEGER,
        validate: {
          len: {
            args: [4, 4],
            msg: 'Movie Year must be in YYYY format'
          }
        }
      }
    },
    {
      defaultScope: {
        attributes: { exclude: ['id', 'createdAt', 'updatedAt'] }
      }
    }
  )
  Movies.associate = function (models) {
    Movies.hasOne(models.MovieData, {
      foreignKey: 'movieID',
      sourceKey: 'movieID',
      onDelete: 'cascade'
    })
    Movies.hasMany(models.UserMovies, {
      foreignKey: 'movieID',
      sourceKey: 'movieID'
    })
    Movies.hasOne(models.UserRating, {
      foreignKey: 'movieID',
      sourceKey: 'movieID'
    })
  }
  return Movies
}
