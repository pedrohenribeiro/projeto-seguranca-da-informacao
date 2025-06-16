module.exports = (sequelize, DataTypes) => {
  const OAuthAccessGrant = sequelize.define('OAuthAccessGrant', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    client_id: { type: DataTypes.STRING, allowNull: false },
    scopes: { type: DataTypes.STRING },
    granted_at: { type: DataTypes.DATE, allowNull: false }
  }, {
    tableName: 'OAuthAccessGrants',
    timestamps: false
  });

  OAuthAccessGrant.associate = (models) => {
    OAuthAccessGrant.belongsTo(models.OAuthClientApp, {
      foreignKey: 'client_id',
      targetKey: 'client_id',
      as: 'clientApp'
    });
  };

  return OAuthAccessGrant;
};
