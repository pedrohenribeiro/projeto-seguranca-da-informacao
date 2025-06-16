module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cep: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [8, 8], is: /^\d+$/ }
    },
    endereco: { type: DataTypes.STRING, allowNull: false },
    bairro: { type: DataTypes.STRING, allowNull: false },
    cidade: { type: DataTypes.STRING, allowNull: false },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [2, 2], is: /^[A-Z]{2}$/ }
    },
    numero: { type: DataTypes.STRING, allowNull: false },
    complemento: { type: DataTypes.STRING }
  }, {
    tableName: 'Enderecos',
    timestamps: true
  });

  Address.associate = (models) => {
    Address.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Address;
};
