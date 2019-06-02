'use strict'
const bcryptService = require('../services/bcrypt.service')

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users',
    {
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: { msg: 'Must provide a valid email' }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [8, 48],
            msg: 'Password must contain 8-48 characters'
          }
        }
      }
    },
    {}
  )
  Users.associate = function (models) {
    Users.hasMany(models.UserMovies, {
      foreignKey: 'userID'
    })
  }
  Users.beforeCreate(async user => {
    return bcryptService()
      .password(user.password)
      .then(hashedPw => {
        user.password = hashedPw
      })
  })

  return Users
}
