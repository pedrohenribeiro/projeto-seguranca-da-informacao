'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('OAuthAccessGrants', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      client_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'OAuthClientApps',
          key: 'client_id',
        },
        onDelete: 'CASCADE',
      },
      scopes: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      granted_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('OAuthAccessGrants');
  }
};
