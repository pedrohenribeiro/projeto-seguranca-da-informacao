'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Receita', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nomereceita: {
        type: Sequelize.STRING
      },
      descricao: {
        type: Sequelize.STRING
      },
      imagem: {
        type: Sequelize.STRING
      },
      ingredientes: {
        type: Sequelize.TEXT
      },
      modopreparo: {
        type: Sequelize.TEXT
      },
      rendimento: {
        type: Sequelize.STRING
      },
      tempopreparo: {
        type: Sequelize.STRING
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