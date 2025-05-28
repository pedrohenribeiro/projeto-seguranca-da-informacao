'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Receita extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //Receita.hasMany(models.Favorito, { foreignKey: 'receitaId' });
    }
  }
  Receita.init({
    nomereceita: DataTypes.STRING,
    descricao: DataTypes.STRING,
    imagem: DataTypes.STRING,
    ingredientes: DataTypes.TEXT,
    modopreparo: DataTypes.TEXT,
    rendimento: DataTypes.STRING,
    tempopreparo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Receita',
  });
  return Receita;
};