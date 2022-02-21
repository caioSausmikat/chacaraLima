import React, { useState } from "react";
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
import { View, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { styles } from "../../assets/styles/styles";
import config from "../../config/config.json";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CriarSenhaScreen(props: any) {
  const [mostrarErroUsuarioSenha, setMostrarErroUsuarioSenha] = useState(false);
  const [usuario, setUsuario] = useState(props.route.params.usuario);
  const [senhaNova, setSenhaNova] = useState("");
  const [senhaNovaConfirmacao, setSenhaNovaConfirmacao] = useState("");
  const [mostrarSenhaNova, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmacaoSenhaNova, setMostrarConfirmacaoNovaSenha] =
    useState(false);

  const mostrarSenhaNovaHandler = () => setMostrarNovaSenha(!mostrarSenhaNova);
  const mostrarConfirmacaoSenhaNovaHandler = () =>
    setMostrarConfirmacaoNovaSenha(!mostrarConfirmacaoSenhaNova);

  async function criarSenha() {
    setMostrarErroUsuarioSenha(false);
    if (senhaNova === senhaNovaConfirmacao) {
      const response = await fetch(config.urlRoot + "criarSenha", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: usuario,
          senhaNova: senhaNova,
        }),
      });

      let atualizadoSucesso = await response.json();
      if (atualizadoSucesso) {
        Alert.alert("Senha criada com Sucesso!");
        props.navigation.navigate("Login");
      }
    } else {
      setMostrarErroUsuarioSenha(true);
      setTimeout(() => {
        setMostrarErroUsuarioSenha(false);
      }, 5000);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginTop: 40, alignItems: "center" }}>
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
          placeholder="Senha"
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
          placeholder="Confirmar Senha"
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
          onPress={() => criarSenha()}
        >
          Criar Senha
        </Button>
      </Stack>
    </SafeAreaView>
  );
}
