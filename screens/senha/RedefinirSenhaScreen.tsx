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
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  Alert,
} from "react-native";
import { styles } from "../../assets/styles/styles";
import config from "../../config/config.json";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RedefinirSenhaScreen(props: any) {
  const [mostrarErroUsuarioSenha, setMostrarErroUsuarioSenha] = useState(false);
  const [usuario, setUsuario] = useState(props.route.params.usuario);
  const [senhaNova, setSenhaNova] = useState("");
  const [senhaNovaConfirmacao, setSenhaNovaConfirmacao] = useState("");
  const [mostrarSenhaNova, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmacaoSenhaNova, setMostrarConfirmacaoNovaSenha] =
    useState(false);
  const [mostrarInputSenha, setMostrarInputSenha] = useState(false);
  const [
    mostrarButtonSolicitarRedefinicaoSenha,
    setMostrarButtonSolicitarRedefinicaoSenha,
  ] = useState(false);
  const [
    mostrarMensagemAguardarAprovacao,
    setMostrarMensagemAguardarAprovacao,
  ] = useState(false);

  const mostrarSenhaNovaHandler = () => setMostrarNovaSenha(!mostrarSenhaNova);
  const mostrarConfirmacaoSenhaNovaHandler = () =>
    setMostrarConfirmacaoNovaSenha(!mostrarConfirmacaoSenhaNova);

  async function proximaEtapaButton() {
    const buscaDetalhesUsuarioReponse = await buscaDetalhesUsuario();
    const jsonBuscarDetalhesUsuario = await buscaDetalhesUsuarioReponse.json();
    await trataRespostaBuscaDetalheUsuario(jsonBuscarDetalhesUsuario);
  }

  function buscaDetalhesUsuario() {
    return fetch(config.urlRoot + "detalhaUsuarioPorNomeUsuario", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuario: usuario,
      }),
    });
  }

  function trataRespostaBuscaDetalheUsuario(json: any) {
    setMostrarInputSenha(false);
    setMostrarMensagemAguardarAprovacao(false);
    setMostrarButtonSolicitarRedefinicaoSenha(false);
    if (json) {
      if (json.senha == null) {
        Alert.alert(
          "Senha n??o cadastrada, favor entrar sem preencher senha para cadastrar!"
        );
        props.navigation.navigate("Login");
      } else {
        switch (json.indicadorAlteracaoSenha) {
          case 0:
            setMostrarButtonSolicitarRedefinicaoSenha(true);
            break;
          case 1:
            setMostrarMensagemAguardarAprovacao(true);
            break;
          case 2:
            setMostrarInputSenha(true);
            break;
        }
      }
    } else {
      Alert.alert("Usu??rio n??o existe!");
    }
  }

  async function solicitarRedefinicaoSenha() {
    const alteraIndicadorAlteracaoSenhaResponse =
      await alteraIndicadorAlteracaoSenha(1);

    let atualizadoSucesso = await alteraIndicadorAlteracaoSenhaResponse.json();
    if (atualizadoSucesso) {
      Alert.alert(
        "Solicita????o enviada, favor aguardar a aprova????o do administrador"
      );
      props.navigation.navigate("Login");
    }

    const buscaTokensResponsaveisResponse = await buscaTokensResponsaveis(
      atualizadoSucesso
    );
    const jsonBuscaTokensResponsaveisResponse =
      await buscaTokensResponsaveisResponse.json();

    await enviaNotificacao(jsonBuscaTokensResponsaveisResponse);
  }

  function alteraIndicadorAlteracaoSenha(indicadorAlteracaoSenha: number) {
    return fetch(config.urlRoot + "alteraIndicadorAlteracaoSenha", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuario: usuario,
        indicadorAlteracaoSenha: indicadorAlteracaoSenha,
      }),
    });
  }

  async function redefinirSenha() {
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
        const alteraIndicadorAlteracaoSenhaResponse =
          await alteraIndicadorAlteracaoSenha(0);
        let alteradoSucesso =
          await alteraIndicadorAlteracaoSenhaResponse.json();
        if (alteradoSucesso) {
          Alert.alert("Senha Redefinida com Sucesso!");
          props.navigation.navigate("Login");
        }
      }
    } else {
      setMostrarErroUsuarioSenha(true);
      setTimeout(() => {
        setMostrarErroUsuarioSenha(false);
      }, 5000);
    }
  }

  function buscaTokensResponsaveis(atualizadoSucesso: any) {
    return fetch(config.urlRoot + "buscaTokensResponsaveis", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
  }

  function enviaNotificacao(tokens: any) {
    for (const item of tokens) {
      if (item.tiposUsuariosId === 1) {
        fetch(config.urlRoot + "notifications", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipient: item.token,
            title: "Redefini????o de senha",
            message: `O usu??rio ${usuario.toUpperCase()} solicitou redefini????o de senha`,
          }),
        });
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={{ marginTop: 40 }} />

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
              placeholder="Usu??rio"
            />
            {mostrarInputSenha && (
              <View style={{ marginTop: 10 }}>
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
                              name={
                                mostrarSenhaNova
                                  ? "visibility-off"
                                  : "visibility"
                              }
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
            )}
            {mostrarErroUsuarioSenha && (
              <Box alignItems="center">
                <FormControl isInvalid w="100%">
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    As senhas n??o est??o iguais!
                  </FormControl.ErrorMessage>
                </FormControl>
              </Box>
            )}
          </Stack>
          {mostrarButtonSolicitarRedefinicaoSenha == false &&
            mostrarInputSenha == false && (
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
                  onPress={() => proximaEtapaButton()}
                >
                  Pr??xima Etapa
                </Button>
              </Stack>
            )}
          {mostrarButtonSolicitarRedefinicaoSenha == true && (
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
                onPress={() => solicitarRedefinicaoSenha()}
              >
                Solicitar Redefini????o de Senha?
              </Button>
            </Stack>
          )}
          {mostrarInputSenha == true && (
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
                Redefinir Senha
              </Button>
            </Stack>
          )}
          {mostrarMensagemAguardarAprovacao == true && (
            <View style={styles.mensagemSolicitacaoRedefinicaoSenhaContainer}>
              <Text style={styles.mensagemSolicitacaoRedefinicaoSenhaText}>
                A solicita????o j?? foi enviada, favor aguardar a aprova????o do
                administrador do sistema.
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
