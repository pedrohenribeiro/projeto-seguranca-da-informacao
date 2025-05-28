const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Receita = sequelize.define('Receita', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nomereceita: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao:{
    type: DataTypes.STRING,
    allowNull: false
  },
  imagem:{
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  ingredientes: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  modopreparo: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  rendimento: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tempopreparo: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Receitas', 
  timestamps: true 
});

module.exports = Receita;