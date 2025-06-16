module.exports = (sequelize, DataTypes) => {
  const OAuthClientApp = sequelize.define('OAuthClientApp', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    client_id: { type: DataTypes.STRING, allowNull: false, unique: true },
    client_secret: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    redirect_uris: { type: DataTypes.JSON, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'OAuthClientApps',
    timestamps: true
  });

  OAuthClientApp.associate = (models) => {
    OAuthClientApp.hasMany(models.OAuthAccessGrant, {
      foreignKey: 'client_id',
      sourceKey: 'client_id',
      as: 'accessGrants'
    });
  };

  return OAuthClientApp;
};
