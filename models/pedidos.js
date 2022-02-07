"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pedidos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Pedidos.belongsTo(models.Restaurantes);
      Pedidos.belongsTo(models.Usuarios);
      Pedidos.belongsTo(models.Produtos);
    }
  }
  Pedidos.init(
    {
      dataPedido: DataTypes.DATEONLY,
      restauranteId: DataTypes.INTEGER,
      usuarioId: DataTypes.INTEGER,
      nomeUsuario: DataTypes.STRING,
      produtoId: DataTypes.INTEGER,
      quantidadeProduto: DataTypes.INTEGER,
      valorProduto: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Pedidos",
    }
  );
  return Pedidos;
};
