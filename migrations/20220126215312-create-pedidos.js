"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Pedidos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      dataPedido: {
        type: Sequelize.DATEONLY,
      },
      restauranteId: {
        type: Sequelize.INTEGER,
        references: {
          model: "restaurantes",
          key: "id",
        },
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        references: {
          model: "usuarios",
          key: "id",
        },
      },
      nomeUsuario: {
        type: Sequelize.STRING,
      },
      produtoId: {
        type: Sequelize.INTEGER,
        references: {
          model: "produtos",
          key: "id",
        },
      },
      quantidadeProduto: {
        type: Sequelize.INTEGER,
      },
      valorProduto: {
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
    await queryInterface.dropTable("Pedidos");
  },
};
