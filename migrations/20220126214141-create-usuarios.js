"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Usuarios", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      usuario: {
        type: Sequelize.STRING,
        unique: true,
      },
      senha: {
        type: Sequelize.STRING,
      },
      nome: {
        type: Sequelize.STRING,
      },
      tiposUsuariosId: {
        type: Sequelize.INTEGER,
        references: {
          model: "tiposusuarios",
          key: "id",
        },
      },
      restaurantesId: {
        type: Sequelize.INTEGER,
        references: {
          model: "restaurantes",
          key: "id",
        },
      },
      indicadorAlteracaoSenha: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Usuarios");
  },
};
