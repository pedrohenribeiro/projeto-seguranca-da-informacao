'use strict';

const fs = require('fs');
const path = require('path');
const sequelize = require('../config/db');
const Sequelize = require('sequelize');
const db = {};
const basename = path.basename(__filename);


fs.readdirSync(__dirname)
  .filter(file => file !== basename && file.endsWith('.js'))
  .forEach(file => {
    const modelModule = require(path.join(__dirname, file));
    let model;


    if (typeof modelModule === 'function' && modelModule.prototype instanceof Sequelize.Model) {
      model = modelModule;
      model.init(model.rawAttributes, {
        sequelize,
        modelName: model.name,
        tableName: model.tableName || undefined,
        timestamps: model.options?.timestamps,
      });
    } else {
      model = modelModule(sequelize, Sequelize.DataTypes);
    }

    db[model.name] = model;
  });

const { User, Term, UserTerm, Endereco, Receita, Favorito } = db;

if (User && Term && UserTerm) {
  User.belongsToMany(Term, { through: UserTerm, foreignKey: 'user_id', otherKey: 'term_id', as: 'termsAccepted' });
  Term.belongsToMany(User, { through: UserTerm, foreignKey: 'term_id', otherKey: 'user_id', as: 'usersAccepted' });
}

if (User && Endereco) {
  User.hasOne(Endereco, { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true });
  Endereco.belongsTo(User, { foreignKey: 'userId' });
}

if (User && Favorito) {
  User.hasMany(Favorito, { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true });
  Favorito.belongsTo(User, { foreignKey: 'userId' });
}

if (Receita && Favorito) {
  Receita.hasMany(Favorito, { foreignKey: 'receitaId', onDelete: 'CASCADE', hooks: true });
  Favorito.belongsTo(Receita, { foreignKey: 'receitaId' });
}

Object.keys(db).forEach(key => {
  if (typeof db[key].associate === 'function') {
    db[key].associate(db);
  }
});

 db.sequelize = sequelize;
 db.Sequelize = Sequelize;

module.exports = db;
