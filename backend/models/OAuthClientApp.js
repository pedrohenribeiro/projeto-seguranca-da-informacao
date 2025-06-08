const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OAuthClientApp = sequelize.define('OAuthClientApp', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    client_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    client_secret: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    redirect_uris: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',  // nome da tabela no banco
        key: 'id',
      },
    },
  }, {
    tableName: 'OAuthClientApps',
    timestamps: true,
  });


module.exports = OAuthClientApp;

