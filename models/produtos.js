"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Produtos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Produtos.hasMany(models.Pedidos);
    }
  }
  Produtos.init(
    {
      nome: DataTypes.STRING,
      ativo: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Produtos",
    }
  );
  return Produtos;
};
