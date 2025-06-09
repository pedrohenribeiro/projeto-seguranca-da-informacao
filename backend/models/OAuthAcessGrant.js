const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OAuthAccessGrant = sequelize.define('OAuthAccessGrant', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  client_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'OAuthClientApps',
      key: 'client_id',
    },
  },
  scopes: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  granted_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'OAuthAccessGrants',
  timestamps: false,
});

OAuthAccessGrant.associate = (models) => {
  OAuthAccessGrant.belongsTo(models.OAuthClientApp, {
    foreignKey: 'client_id',
    targetKey: 'client_id',
    as: 'clientApp',
  });
};

module.exports = OAuthAccessGrant;
