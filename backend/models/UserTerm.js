// UserTerm.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('UserTerm', {
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
};
