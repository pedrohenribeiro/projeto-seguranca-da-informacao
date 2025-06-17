// models/Term.js
module.exports = (sequelize, DataTypes) => {
  const Term = sequelize.define('Term', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    detalhes: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    obrigatorio: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    term_version_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'term_versions',
        key: 'id',
      },
    },
  }, {
    tableName: 'terms',
    timestamps: true,
    underscored: false,
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
