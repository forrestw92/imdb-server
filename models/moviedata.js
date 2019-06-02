'use strict'
module.exports = (sequelize, DataTypes) => {
  const MovieData = sequelize.define(
    'MovieData',
    {
      storyline: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Movie must contain a storyline'
          }
        }
      },
      taglines: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: 'Movie must contain a tagline'
          }
        }
      },
      genres: {
        type: DataTypes.STRING,
        get: function () {
          return JSON.parse(this.getDataValue('genres'))
        },
        set: function (value) {
          this.setDataValue('genres', JSON.stringify(value))
        }
      },
      releaseDate: {
        type: DataTypes.DATE,
        validate: {
          isDate: {
            msg: 'Release Date must be a valid date'
          }
        }
      },
      runtime: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: {
            msg: 'Runtime must be an integer of minutes'
          }
        }
      },
      movieID: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { notEmpty: 'Must contain a movieID' }
      },
      rating: {
        type: DataTypes.INTEGER,
        validate: {
          isNumeric: { msg: 'Rating must be a integer' },
          min: {
            args: 1,
            msg: 'Rating must be 1 or greater'
          },
          max: {
            args: 10,
            msg: 'Rating must be 10 or less'
          }
        }
      },
      ratingCount: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: {
            msg: 'Rating must be an integer'
          }
        }
      },
      mpaaRating: {
        type: DataTypes.STRING,
        validate: {
          isIn: {
            args: [['G', 'PG', 'PG-13', 'R', 'NC-17']],
            msg: 'Must be a valid mpaa rating(G,PG,PG-13,R,NC-17)'
          }
        }
      }
      /**
       * Add new rows here. Validation is optional
       */
    },
    {
      defaultScope: {
        attributes: { exclude: ['id', 'movieID', 'createdAt', 'updatedAt'] }
      }
    }
  )
  MovieData.associate = function (models) {
    MovieData.belongsTo(models.Movies, {
      foreignKey: 'movieID',
      targetKey: 'movieID',
      onDelete: 'cascade'
    })
  }
  return MovieData
}
