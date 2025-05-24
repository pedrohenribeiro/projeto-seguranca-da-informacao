const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Endereco = sequelize.define('Address', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  cep: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8, 8], // Exatamente 8 dígitos
      is: /^\d+$/ // Apenas dígitos
    }
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bairro: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 2], // Exatamente 2 caracteres (UF)
      is: /^[A-Z]{2}$/ 
    }
  },
  numero: {
    type: DataTypes.STRING,
    allowNull: false
  },
  complemento: {
    type: DataTypes.STRING,
    allowNull: true 
  }
}, {
  tableName: 'Enderecos',
  timestamps: true
});

User.hasOne(Endereco, { foreignKey: 'userId', onDelete: 'CASCADE' });
Endereco.belongsTo(User, { foreignKey: 'userId' });

module.exports = Endereco;