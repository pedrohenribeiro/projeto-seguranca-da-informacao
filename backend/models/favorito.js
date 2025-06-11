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

  return Favorito;
};
