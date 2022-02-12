/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Administrador: NavigatorScreenParams<RootTabParamList> | undefined;
  Usuario: undefined;
  Cliente: undefined;
  Login: undefined;
  AlterarRestaurantes: undefined;
  EditarUsuario: undefined;
  RedefinirSenha: undefined;
  RedefinirPropriaSenha: undefined;
  CriarSenha: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  Pedidos: undefined;
  Restaurantes: undefined;
  Produtos: undefined;
  Usuarios: undefined;
  Relatorios: undefined;
  RedefinirPropriaSenha: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
