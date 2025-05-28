const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Favorito = sequelize.define('Favorito', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receitaId:{
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'Favoritos', 
  timestamps: true 
});

module.exports = Favorito;
