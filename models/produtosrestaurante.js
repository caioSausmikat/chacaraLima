"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProdutosRestaurante extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProdutosRestaurante.belongsTo(models.Restaurantes);
      ProdutosRestaurante.belongsTo(models.Produtos);
    }
  }
  ProdutosRestaurante.init(
    {
      restauranteId: DataTypes.INTEGER,
      produtoId: DataTypes.INTEGER,
      valor: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "ProdutosRestaurante",
    }
  );
  return ProdutosRestaurante;
};
