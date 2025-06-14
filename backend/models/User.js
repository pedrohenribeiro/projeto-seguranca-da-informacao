module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    nome: { type: DataTypes.STRING },
    cpf: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    telefone: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'user' }
  }, {
    tableName: 'Users',
    timestamps: true
  });

  User.associate = (models) => {
    User.hasMany(models.OAuthClientApp, { foreignKey: 'user_id', as: 'apps' });
    User.belongsToMany(models.Term, {
      through: models.UserTerm,
      foreignKey: 'user_id',
      otherKey: 'term_id',
      as: 'termsAccepted'
    });
    User.hasOne(models.Address, { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true });
    User.hasMany(models.Favorito, { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true });
  };

  return User;
};
