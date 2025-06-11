'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const modelModule = require(path.join(__dirname, file));

    let model;

    // Se o model exportar uma classe que herda de Sequelize.Model
    if (typeof modelModule === 'function' && modelModule.prototype instanceof Sequelize.Model) {
      model = modelModule; // vai usar init depois
      model.init(model.rawAttributes, {
        sequelize,
        modelName: model.name,
        tableName: model.tableName || undefined,
        timestamps: model.options?.timestamps,
      });
    }
    // Se for uma factory function tradicional (define)
    else if (typeof modelModule === 'function') {
      model = modelModule(sequelize, Sequelize.DataTypes);
    } else {
      model = modelModule;
    }

    db[model.name] = model;
  });

// Associações
const { User, Term, UserTerm } = db;

if (User && Term && UserTerm) {
  User.belongsToMany(Term, {
    through: UserTerm,
    foreignKey: 'user_id',
    otherKey: 'term_id',
    as: 'termsAccepted'
  });

  Term.belongsToMany(User, {
    through: UserTerm,
    foreignKey: 'term_id',
    otherKey: 'user_id',
    as: 'usersAccepted'
  });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
