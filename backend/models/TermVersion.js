// models/TermVersion.js
module.exports = (sequelize, DataTypes) => {
  const TermVersion = sequelize.define('TermVersion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    numero: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: 'term_versions',
    timestamps: true,
    underscored: false
    ,
  });

  TermVersion.associate = models => {
    TermVersion.hasMany(models.Term, {
      foreignKey: 'term_version_id',
      as: 'termos',
      onDelete: 'CASCADE',
    });
  };

  return TermVersion;
};
