module.exports = function(sequelize, DataTypes) {
  var Arduino = sequelize.define('Arduino', {
    description: {
      type: DataTypes.STRING
    },
    pin: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.STRING
    },
    labelOn: {
      type: DataTypes.STRING
    },
    labelOff: {
      type: DataTypes.STRING
    }
  })

  return Arduino
}
