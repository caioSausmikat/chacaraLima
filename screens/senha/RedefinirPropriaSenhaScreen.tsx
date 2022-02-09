import React, { useState, useEffect } from "react";
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
  Platform,
  Text,
  Alert,
} from "react-native";
import { styles } from "../../assets/styles/styles";
import config from "../../config/config.json";

export default function RedefinirPropriaSenhaScreen(props: any) {
  const [mostrarErroUsuarioSenha, setMostrarErroUsuarioSenha] = useState(false);
  const [mostrarErroSenhaAtual, setMostrarErroSenhaAtual] = useState(false);
  const [usuario, setUsuario] = useState(props.route.params.usuario.usuario);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [senhaNova, setSenhaNova] = useState("");
  const [senhaNovaConfirmacao, setSenhaNovaConfirmacao] = useState("");
  const [mostrarSenhaAtual, setMostrarAtualSenha] = useState(false);
  const [mostrarSenhaNova, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmacaoSenhaNova, setMostrarConfirmacaoNovaSenha] =
    useState(false);

  const mostrarSenhaAtualHandler = () =>
    setMostrarAtualSenha(!mostrarSenhaAtual);
  const mostrarSenhaNovaHandler = () => setMostrarNovaSenha(!mostrarSenhaNova);
  const mostrarConfirmacaoSenhaNovaHandler = () =>
    setMostrarConfirmacaoNovaSenha(!mostrarConfirmacaoSenhaNova);

  async function redefinirSenha() {
    setMostrarErroUsuarioSenha(false);
    setMostrarErroSenhaAtual(false);
    if (senhaNova === senhaNovaConfirmacao) {
      const response = await fetch(config.urlRoot + "redefinirSenha", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: usuario,
          senhaAtual: senhaAtual,
          senhaNova: senhaNova,
        }),
      });

      let atualizadoSucesso = await response.json();
      if (atualizadoSucesso) {
        Alert.alert("Senha Alterada com Sucesso!");
        props.navigation.navigate("Login");
      } else {
        setMostrarErroSenhaAtual(true);
        setTimeout(() => {
          setMostrarErroSenhaAtual(false);
        }, 5000);
      }
    } else {
      setMostrarErroUsuarioSenha(true);
      setTimeout(() => {
        setMostrarErroUsuarioSenha(false);
      }, 5000);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={{ marginTop: 40, alignItems: "center" }}>
        <Input
          w={{
            base: "75%",
            md: "25%",
          }}
          type={mostrarSenhaAtual ? "text" : "password"}
          InputRightElement={
            <IconButton
              icon={
                <Icon
                  as={
                    <MaterialIcons
                      name={mostrarSenhaAtual ? "visibility-off" : "visibility"}
                    />
                  }
                  size={5}
                  mr="2"
                  color="muted.400"
                  onPress={mostrarSenhaAtualHandler}
                />
              }
            />
          }
          onChangeText={(text) => setSenhaAtual(text)}
          placeholder="Senha Atual"
        />
        {mostrarErroSenhaAtual && (
          <Box alignSelf="center">
            <FormControl isInvalid w="100%">
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                A senha atual está incorreta
              </FormControl.ErrorMessage>
            </FormControl>
          </Box>
        )}
        <View style={{ marginTop: 10 }}></View>
        <Input
          w={{
            base: "75%",
            md: "25%",
          }}
          type={mostrarSenhaNova ? "text" : "password"}
          InputRightElement={
            <IconButton
              icon={
                <Icon
                  as={
                    <MaterialIcons
                      name={mostrarSenhaNova ? "visibility-off" : "visibility"}
                    />
                  }
                  size={5}
                  mr="2"
                  color="muted.400"
                  onPress={mostrarSenhaNovaHandler}
                />
              }
            />
          }
          onChangeText={(text) => setSenhaNova(text)}
          placeholder="Senha Nova"
        />
        <View style={{ marginTop: 10 }}></View>
        <Input
          w={{
            base: "75%",
            md: "25%",
          }}
          type={mostrarConfirmacaoSenhaNova ? "text" : "password"}
          InputRightElement={
            <IconButton
              icon={
                <Icon
                  as={
                    <MaterialIcons
                      name={
                        mostrarConfirmacaoSenhaNova
                          ? "visibility-off"
                          : "visibility"
                      }
                    />
                  }
                  size={5}
                  mr="2"
                  color="muted.400"
                  onPress={mostrarConfirmacaoSenhaNovaHandler}
                />
              }
            />
          }
          onChangeText={(text) => setSenhaNovaConfirmacao(text)}
          placeholder="Confirmar Senha Nova"
        />
      </View>
      {mostrarErroUsuarioSenha && (
        <Box alignSelf="center">
          <FormControl isInvalid w="100%">
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              As senhas não estão iguais!
            </FormControl.ErrorMessage>
          </FormControl>
        </Box>
      )}
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
          onPress={() => redefinirSenha()}
        >
          Alterar Senha
        </Button>
      </Stack>
    </KeyboardAvoidingView>
  );
}
