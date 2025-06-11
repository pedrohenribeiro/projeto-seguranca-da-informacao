// Term.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Term', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    detalhes: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    obrigatorio: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'terms',
    timestamps: true
  });
};
