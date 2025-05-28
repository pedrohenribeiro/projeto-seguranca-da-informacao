'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Receitas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nomereceita: {
        type: Sequelize.STRING,
        allowNull: false
      },
      descricao: {
        type: Sequelize.STRING,
        allowNull: false
      },
      imagem: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ingredientes: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      modopreparo: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      rendimento: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tempopreparo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Receita');
  }
};