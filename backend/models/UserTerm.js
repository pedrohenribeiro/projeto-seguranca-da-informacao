module.exports = (sequelize, DataTypes) => {
  const UserTerm = sequelize.define('UserTerm', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    term_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    aceito_em: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'user_terms',
    timestamps: true,
  });

  UserTerm.associate = (models) => {
    UserTerm.belongsTo(models.User, { foreignKey: 'user_id' });
    UserTerm.belongsTo(models.Term, { foreignKey: 'term_id' });
  };

  return UserTerm;
};
