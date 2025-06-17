'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Cria a tabela de versões
    await queryInterface.createTable('term_versions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      numero: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      }
    });

    // 2. Adiciona a coluna como opcional no início
    await queryInterface.addColumn('terms', 'term_version_id', {
      type: Sequelize.INTEGER,
      allowNull: true, // <- PERMITE valores nulos temporariamente
      references: {
        model: 'term_versions',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    // 3. Cria uma versão inicial e associa os termos existentes
    const [results] = await queryInterface.sequelize.query(
      `INSERT INTO term_versions (numero, createdAt, updatedAt)
       VALUES ('1.0', NOW(), NOW())`
    );

    const [[versao]] = await queryInterface.sequelize.query(
      `SELECT id FROM term_versions WHERE numero = '1.0' LIMIT 1`
    );

    await queryInterface.sequelize.query(
      `UPDATE terms SET term_version_id = ${versao.id}`
    );

    // 4. Agora torna a coluna obrigatória
    await queryInterface.changeColumn('terms', 'term_version_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'term_versions',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('terms', 'term_version_id');
    await queryInterface.dropTable('term_versions');
  }
};
