module.exports = (sequelize, DataTypes) => {
  const Favorito = sequelize.define('Favorito', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    receitaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    }
  }, {
    tableName: 'Favoritos',
    timestamps: true,
  });

  Favorito.associate = (models) => {
    Favorito.belongsTo(models.User, { foreignKey: 'userId' });
    Favorito.belongsTo(models.Receita, { foreignKey: 'receitaId' });
  };

  return Favorito;
};
