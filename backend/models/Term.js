module.exports = (sequelize, DataTypes) => {
  const Term = sequelize.define('Term', {
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

  Term.associate = (models) => {
    Term.belongsToMany(models.User, {
      through: models.UserTerm,
      foreignKey: 'term_id',
      otherKey: 'user_id',
      as: 'usersAccepted'
    });
  };

  return Term;
};
