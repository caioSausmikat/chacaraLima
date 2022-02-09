"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Tokens.hasMany(models.Usuarios);
    }
  }
  Tokens.init(
    {
      token: DataTypes.STRING,
      usuarioId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Tokens",
    }
  );
  return Tokens;
};
