'use strict';
module.exports = (sequelize, DataTypes) => {
  const Favorito = sequelize.define('Favorito', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receitaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'Favoritos',
    timestamps: true
  });

  return Favorito;
};
