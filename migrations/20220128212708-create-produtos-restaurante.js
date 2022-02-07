"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ProdutosRestaurantes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      restauranteId: {
        type: Sequelize.INTEGER,
        references: {
          model: "restaurantes",
          key: "id",
        },
      },
      produtoId: {
        type: Sequelize.INTEGER,
        references: {
          model: "produtos",
          key: "id",
        },
      },
      valor: {
        type: Sequelize.FLOAT,
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
    await queryInterface.dropTable("ProdutosRestaurantes");
  },
};
