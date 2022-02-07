/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName, Pressable, Text, View } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import PedidosScreen from "../screens/administrador/pedidos/PedidosScreen";
import RestaurantesScreen from "../screens/administrador/restaurantes/RestaurantesScreen";
import ProdutosScreen from "../screens/administrador/produtos/ProdutosScreen";
import AlterarRestaurantesScreen from "../screens/administrador/restaurantes/AlterarRestaurantesScreen";
import UsuariosScreen from "../screens/administrador/usuarios/UsuariosScreen";
import EditarUsuarioScreen from "../screens/administrador/usuarios/EditarUsuarioScreen";
import RedefinirSenhaScreen from "../screens/senha/RedefinirSenhaScreen";
import Login from "../screens/Login";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { Ionicons } from "@expo/vector-icons";

export default function Navigation(
  { route }: { route: any },
  { colorScheme }: { colorScheme: ColorSchemeName }
) {
  return (
    <NavigationContainer linking={LinkingConfiguration} theme={DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RedefinirSenha"
        component={RedefinirSenhaScreen}
        options={() => ({
          headerShown: true,
          headerTitle: "Redefinir Senha",
        })}
      />
      <Stack.Screen
        name="Administrador"
        component={BottomTabNavigator}
        options={({ route }) => ({
          headerShown: true,
          headerTitle: route.params.usuario.nome,
        })}
      />
      <Stack.Screen
        name="EditarUsuario"
        component={EditarUsuarioScreen}
        options={({ route }) => ({
          headerShown: true,
          headerTitle: route.params.usuario.nome,
        })}
      />
      <Stack.Screen
        name="AlterarRestaurantes"
        component={AlterarRestaurantesScreen}
        options={{
          headerShown: true,
          headerTitle: "Clientes",
        }}
      />
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator({ route }) {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Pedidos"
      screenOptions={{
        tabBarActiveTintColor: Colors["light"].tint,
      }}
    >
      <BottomTab.Screen
        name="Pedidos"
        component={PedidosScreen}
        initialParams={{ usuarioLogado: route.params.usuario }}
        options={{
          headerTitle: "",
          headerTransparent: true,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            iconName = focused ? "document-text" : "document-text-outline";

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        }}
      />
      <BottomTab.Screen
        name="Restaurantes"
        component={RestaurantesScreen}
        options={({ navigation }: RootTabScreenProps<"Restaurantes">) => ({
          title: "Clientes",
          headerTitle: "",
          headerTransparent: true,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            iconName = focused ? "ios-restaurant" : "ios-restaurant-outline";

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("AlterarRestaurantes")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#4b9666",
                  marginRight: 20,
                  marginBottom: 15,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    padding: 5,
                  }}
                >
                  Alterar Clientes
                </Text>
              </View>
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="Produtos"
        component={ProdutosScreen}
        options={({ navigation }: RootTabScreenProps<"Produtos">) => ({
          title: "Produtos",
          headerTitle: "",
          headerTransparent: true,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            iconName = focused ? "leaf" : "leaf-outline";

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      />
      <BottomTab.Screen
        name="Usuarios"
        component={UsuariosScreen}
        initialParams={{ usuarioLogado: route.params.usuario }}
        options={{
          title: "Usuarios",
          headerTitle: "",
          headerTransparent: true,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            iconName = focused ? "people-sharp" : "people-outline";

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
