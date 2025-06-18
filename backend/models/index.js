'use strict';

const fs = require('fs');
const path = require('path');
const sequelize = require('../config/db');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    );
  })
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
    } else if (typeof modelModule === 'function') {
      model = modelModule(sequelize, Sequelize.DataTypes);
    } else {
      model = modelModule;
    }

    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
