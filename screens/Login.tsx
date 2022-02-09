import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { RootStackScreenProps } from "../types";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Input,
  Stack,
  Icon,
  IconButton,
  Button,
  Box,
  FormControl,
  WarningOutlineIcon,
} from "native-base";
import {
  View,
  KeyboardAvoidingView,
  Image,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import { styles } from "../assets/styles/styles";
import config from "../config/config.json";

export default function Login({ navigation }: RootStackScreenProps<"Login">) {
  const [mostrarErroUsuarioSenha, setMostrarErroUsuarioSenha] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [login, setLogin] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  useEffect(() => {
    verifyLogin();
  }, []);

  useEffect(() => {
    if (login === true) {
      biometric();
    }
  }, [login]);

  const mostrarSenhaHandler = () => setMostrarSenha(!mostrarSenha);

  //Verifica se o usuário já possui algum login
  async function verifyLogin() {
    let response = await AsyncStorage.getItem("userData");
    let json = await JSON.parse(response);
    if (json !== null) {
      setUsuario(json.usuario);
      setSenha(json.senha);
      setLogin(true);
    }
  }

  //Biometria
  async function biometric() {
    let compatible = await LocalAuthentication.hasHardwareAsync();
    if (compatible) {
      let biometricRecords = await LocalAuthentication.isEnrolledAsync();
      if (biometricRecords) {
        let result = await LocalAuthentication.authenticateAsync();
        if (result.success) {
          sendForm();
        } else {
          setUsuario("");
          setSenha("");
        }
      }
    }
  }

  //Envio do formulario de login
  async function sendForm() {
    if (usuario === "" || senha === "") {
      if (usuario !== "") {
        let response = await fetch(`${config.urlRoot}verificaUsuarioNovo`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usuario: usuario.toUpperCase(),
          }),
        });
        let json = await response.json();
        if (json === "erro" || json.senha != null) {
          setMostrarErroUsuarioSenha(true);
          setTimeout(() => {
            setMostrarErroUsuarioSenha(false);
          }, 5000);
        } else {
          if (json.senha == null) {
            navigation.navigate("CriarSenha", { usuario: usuario });
          }
        }
      } else {
        setMostrarErroUsuarioSenha(true);
        setTimeout(() => {
          setMostrarErroUsuarioSenha(false);
        }, 5000);
      }
    } else {
      let response = await fetch(`${config.urlRoot}login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: usuario.toUpperCase(),
          senha: senha,
        }),
      });
      let json = await response.json();
      if (json === "erro") {
        setMostrarErroUsuarioSenha(true);
        setTimeout(() => {
          setMostrarErroUsuarioSenha(false);
        }, 5000);
        await AsyncStorage.clear();
      } else {
        await AsyncStorage.setItem("userData", JSON.stringify(json));
        switch (json.tiposUsuariosId) {
          case 1:
            navigation.navigate("Administrador", { usuario: json });
            break;
          case 2:
            navigation.navigate("Usuario", { usuario: json });
            break;
          case 3:
            navigation.navigate("Cliente", { usuario: json });
            break;
        }
      }
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { justifyContent: "center" }]}
    >
      <View>
        <Image
          source={require("../assets/images/logomarca.png")}
          style={styles.logomarca}
        ></Image>
      </View>

      <View>
        <Stack space={4} w="100%" alignItems="center">
          <Input
            w={{
              base: "75%",
              md: "25%",
            }}
            InputLeftElement={
              <Icon
                as={<MaterialIcons name="person" />}
                size={5}
                ml="2"
                color="muted.400"
              />
            }
            value={usuario}
            onChangeText={(text) => setUsuario(text)}
            placeholder="Usuário"
          />
          <Input
            w={{
              base: "75%",
              md: "25%",
            }}
            type={mostrarSenha ? "text" : "password"}
            InputRightElement={
              <IconButton
                icon={
                  <Icon
                    as={
                      <MaterialIcons
                        name={mostrarSenha ? "visibility-off" : "visibility"}
                      />
                    }
                    size={5}
                    mr="2"
                    color="muted.400"
                    onPress={mostrarSenhaHandler}
                  />
                }
              />
            }
            value={senha}
            onChangeText={(text) => setSenha(text)}
            placeholder="Senha"
          />
          {mostrarErroUsuarioSenha && (
            <Box alignItems="center">
              <FormControl isInvalid w="100%">
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  Usuário ou senha inválidos
                </FormControl.ErrorMessage>
              </FormControl>
            </Box>
          )}
        </Stack>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("RedefinirSenha", { usuario: usuario });
          }}
        >
          <View style={styles.esqueceuSenhaContainer}>
            <Text style={styles.esqueceuSenhaText}>Esqueceu sua senha?</Text>
          </View>
        </TouchableOpacity>
        <Stack
          mb="2.5"
          mt="1.5"
          direction={{
            base: "column",
            md: "row",
          }}
          space={2}
          mx={{
            base: "auto",
            md: "0",
          }}
        >
          <Button
            size="lg"
            variant="solid"
            colorScheme="emerald"
            style={styles.loginButton}
            onPress={() => sendForm()}
          >
            Entrar
          </Button>
        </Stack>
      </View>
    </KeyboardAvoidingView>
  );
}
