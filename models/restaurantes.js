"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Restaurantes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Restaurantes.hasMany(models.Pedidos);
    }
  }
  Restaurantes.init(
    {
      nome: DataTypes.STRING,
      ativo: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Restaurantes",
    }
  );
  return Restaurantes;
};
