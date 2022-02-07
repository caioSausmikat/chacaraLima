"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Usuarios extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Usuarios.hasMany(models.Pedidos);
      // Usuarios.hasMany(models.TiposUsuarios);
      // Usuarios.hasMany(models.Restaurantes);
    }
  }
  Usuarios.init(
    {
      usuario: DataTypes.STRING,
      senha: DataTypes.STRING,
      nome: DataTypes.STRING,
      tiposUsuariosId: DataTypes.INTEGER,
      restaurantesId: DataTypes.INTEGER,
      indicadorAlteracaoSenha: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Usuarios",
    }
  );
  return Usuarios;
};
