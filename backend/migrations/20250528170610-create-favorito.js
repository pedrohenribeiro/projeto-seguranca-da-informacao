'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Favoritos', {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      receitaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Receitas',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
    });

    // Garante que não haverá duplicatas
    await queryInterface.addConstraint('Favoritos', {
      fields: ['userId', 'receitaId'],
      type: 'primary key',
      name: 'favoritos_pkey'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Favoritos');
  }
};
