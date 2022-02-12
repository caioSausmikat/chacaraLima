/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { RootStackParamList } from "../types";

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Administrador: {
        screens: {
          Pedidos: {
            screens: {
              PedidosScreen: "pedidos",
            },
          },
          Restaurantes: {
            screens: {
              RestaurantesScreen: "restaurantes",
            },
          },
          Produtos: {
            screens: {
              ProdutosScreen: "produtos",
            },
          },
          Usuarios: {
            screens: {
              UsuariosScreen: "usuarios",
            },
          },
          Relatorios: {
            screens: {
              RelatoriosScreen: "relatorios",
            },
          },
        },
      },
      Usuario: "Usuario",
      Cliente: "Cliente",
      Login: "Login",
      RedefinirSenha: "RedefinirSenha",
      RedefinirPropriaSenha: "RedefinirPropriaSenha",
      CriarSenha: "CriarSenha",
      AlterarRestaurantes: "AlterarRestaurantes",
      EditarUsuario: "EditarUsuario",
    },
  },
};

export default linking;
