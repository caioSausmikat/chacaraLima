import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  Keyboard,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import {
  Input,
  Icon,
  IconButton,
  Box,
  FormControl,
  WarningOutlineIcon,
} from "native-base";
import { styles } from "../../../assets/styles/styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RootTabScreenProps } from "../../../types";
import config from "../../../config/config.json";
import DropDownPicker from "react-native-dropdown-picker";
import { MaterialIcons } from "@expo/vector-icons";

interface TiposUsuariosDropdownList {
  label: string;
  value: number;
}
interface RestauranteDropdownList {
  label: string;
  value: number;
}

export default function EditarUsuarioScreen(props: any) {
  const [openDropDownTiposUsuarios, setOpenDropDownTiposUsuarios] =
    useState(false);
  const [openDropDownRestaurantes, setOpenDropDownRestaurantes] =
    useState(false);

  const [codigoRestauranteSelecionado, setCodigoRestauranteSelecionado] =
    useState(0);
  const [codigoTipoUsuarioSelecionado, setCodigoTipoUsuarioSelecionado] =
    useState(0);

  let [listaTiposUsuarios, setListaTiposUsuarios] = useState<
    TiposUsuariosDropdownList[]
  >([]);

  let [listaRestaurantes, setListaRestaurantes] = useState<
    RestauranteDropdownList[]
  >([]);

  const [usuarioInicial, setUsuarioInicial] = useState({});
  const [usuario, setUsuario] = useState("");
  const [nome, setNome] = useState("");
  const [
    mostrarButtonAutorizarRedefinicaoSenha,
    setMostrarButtonAutorizarRedefinicaoSenha,
  ] = useState(false);

  const [senhaNova, setSenhaNova] = useState("");
  const [senhaNovaConfirmacao, setSenhaNovaConfirmacao] = useState("");
  const [mostrarInputTrocarSenha, setMostrarInputTrocarSenha] = useState(false);
  const [mostrarSenhaNova, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmacaoSenhaNova, setMostrarConfirmacaoNovaSenha] =
    useState(false);
  const [mostrarErroUsuarioSenha, setMostrarErroUsuarioSenha] = useState(false);

  useEffect(() => {
    buscarDadosIniciais();
  }, []);

  async function buscarDadosIniciais() {
    try {
      const buscarDetalhesUsuarioResponse = await buscaDetalhesUsuario(
        props.route.params.usuario.usuarioId
      );
      const jsonBuscarDetalhesUsuario =
        await buscarDetalhesUsuarioResponse.json();

      const buscaTiposUsuariosResponse = await buscaTiposUsuarios();
      const jsonBuscaTiposUsuarios = await buscaTiposUsuariosResponse.json();

      const buscaListaRestaurantesResponse = await buscaListaRestaurantes();
      const jsonBuscaListaRestaurantes =
        await buscaListaRestaurantesResponse.json();

      await carregarDetalhesUsuario(
        jsonBuscarDetalhesUsuario,
        jsonBuscaTiposUsuarios,
        jsonBuscaListaRestaurantes
      );
    } catch (error) {
      console.log({ error });
    }
  }

  function buscaDetalhesUsuario(ususarioId: number) {
    return fetch(config.urlRoot + "detalhaUsuario", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: ususarioId,
      }),
    });
  }

  function buscaTiposUsuarios() {
    return fetch(config.urlRoot + "listaTiposUsuarios", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  function buscaListaRestaurantes() {
    return fetch(config.urlRoot + "listaRestaurantes", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  function carregarDetalhesUsuario(
    jsonDetalhesUsuario: any,
    jsonListaTiposUsuarios: any,
    jsonListaRestaurantes: any
  ) {
    setUsuarioInicial(jsonDetalhesUsuario);

    setUsuario(jsonDetalhesUsuario.usuario);
    setNome(jsonDetalhesUsuario.nome);

    setMostrarButtonAutorizarRedefinicaoSenha(false);
    if (jsonDetalhesUsuario.indicadorAlteracaoSenha === 1) {
      setMostrarButtonAutorizarRedefinicaoSenha(true);
    }
    setMostrarInputTrocarSenha(false);
    if (
      props.route.params.usuario.usuario ===
      props.route.params.usuarioLogado.usuario
    ) {
      setMostrarInputTrocarSenha(true);
    }

    listaTiposUsuarios.length = 0;
    for (const tipoUsuario of jsonListaTiposUsuarios) {
      listaTiposUsuarios.push({
        label: tipoUsuario.nomeTipo,
        value: tipoUsuario.id,
      });
    }

    listaRestaurantes.length = 0;
    listaRestaurantes.push({ label: "Sem Vínculo", value: 99999 });
    for (const restaurante of jsonListaRestaurantes) {
      listaRestaurantes.push({
        label: restaurante.nome,
        value: restaurante.id,
      });
    }

    setCodigoTipoUsuarioSelecionado(jsonDetalhesUsuario.tiposUsuariosId);

    jsonDetalhesUsuario.restaurantesId
      ? setCodigoRestauranteSelecionado(jsonDetalhesUsuario.restaurantesId)
      : setCodigoRestauranteSelecionado(99999);
  }

  async function atualizarUsuarioHandler() {
    if (usuario.toUpperCase() !== usuarioInicial.usuario) {
      const response = await fetch(config.urlRoot + "atualizaUsuario", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: usuarioInicial.id,
          usuario: usuario.toUpperCase(),
        }),
      });

      let atualizadoSucesso = await response.json();
      if (atualizadoSucesso) {
        await buscarDadosIniciais();
        Keyboard.dismiss();
      }
    }
  }

  async function atualizarNomeUsuarioHandler() {
    if (nome !== usuarioInicial.nome) {
      const response = await fetch(config.urlRoot + "atualizaNomeUsuario", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: usuarioInicial.id,
          nome: nome,
        }),
      });
      let atualizadoSucesso = await response.json();
      if (atualizadoSucesso) {
        await buscarDadosIniciais();
        Keyboard.dismiss();
      }
    }
  }

  async function atualizaTipoUsuario() {
    if (codigoTipoUsuarioSelecionado !== usuarioInicial.tiposUsuariosId) {
      const response = await fetch(config.urlRoot + "atualizaTipoUsuario", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: usuarioInicial.id,
          tiposUsuariosId: codigoTipoUsuarioSelecionado,
        }),
      });
      let atualizadoSucesso = await response.json();
      if (atualizadoSucesso) {
        await buscarDadosIniciais();
      }
    }
  }

  async function atualizaRestauranteUsuario() {
    if (codigoRestauranteSelecionado !== usuarioInicial.restaurantesId) {
      const response = await fetch(
        config.urlRoot + "atualizaRestauranteUsuario",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: usuarioInicial.id,
            restaurantesId: codigoRestauranteSelecionado,
          }),
        }
      );
      let atualizadoSucesso = await response.json();
      if (atualizadoSucesso) {
        await buscarDadosIniciais();
      }
    }
  }

  async function autorizaRedefinicaoSenha(indicadorAlteracaoSenha: number) {
    const response = await fetch(
      config.urlRoot + "alteraIndicadorAlteracaoSenha",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: usuario,
          indicadorAlteracaoSenha: indicadorAlteracaoSenha,
        }),
      }
    );
    let autorizadoSucesso = await response.json();
    if (autorizadoSucesso) {
      Alert.alert("Redefinição de senha autorizada com sucesso!");
      setMostrarButtonAutorizarRedefinicaoSenha(false);
    }
  }

  async function redefinirSenha() {
    setMostrarErroUsuarioSenha(false);
    if (senhaNova === senhaNovaConfirmacao) {
      const response = await fetch(config.urlRoot + "redefinirSenha", {
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
        Alert.alert("Senha Redefinida com Sucesso!");
        setSenhaNova("");
        setSenhaNovaConfirmacao("");
      }
    } else {
      setMostrarErroUsuarioSenha(true);
    }
  }

  const usuarioInputHandler = (valor: string) => {
    setUsuario(valor);
  };

  const nomeInputHandler = (valor: string) => {
    setNome(valor);
  };

  const mostrarSenhaNovaHandler = () => setMostrarNovaSenha(!mostrarSenhaNova);

  const mostrarConfirmacaoSenhaNovaHandler = () =>
    setMostrarConfirmacaoNovaSenha(!mostrarConfirmacaoSenhaNova);

  return (
    <View style={styles.container}>
      <Text style={[styles.textFormContainer, { marginTop: 10 }]}>
        Usuário:{" "}
      </Text>
      <View style={styles.editarUsuarioInputContainer}>
        <TextInput
          value={usuario}
          onChangeText={usuarioInputHandler}
          onBlur={() => {
            atualizarUsuarioHandler();
          }}
        />
      </View>
      <Text style={styles.textFormContainer}>Nome: </Text>
      <View style={styles.editarUsuarioInputContainer}>
        <TextInput
          value={nome}
          onChangeText={nomeInputHandler}
          onBlur={() => {
            atualizarNomeUsuarioHandler();
          }}
        />
      </View>
      <Text style={styles.textFormContainer}>Tipo de Usuário: </Text>
      <View
        style={[
          styles.dropdownPickerEditarUsuarioContainer,
          Platform.OS === "ios" ? { zIndex: 3000 } : null,
        ]}
      >
        <DropDownPicker
          zIndex={3000}
          zIndexInverse={1000}
          style={styles.dropdownPickerEditarUsuario}
          open={openDropDownTiposUsuarios}
          value={codigoTipoUsuarioSelecionado}
          items={listaTiposUsuarios}
          setOpen={setOpenDropDownTiposUsuarios}
          setValue={setCodigoTipoUsuarioSelecionado}
          dropDownContainerStyle={{
            borderColor: "green",
          }}
          placeholder="Selecione o tipo de usuário"
          onChangeValue={() => {
            atualizaTipoUsuario();
          }}
        />
      </View>
      <Text style={styles.textFormContainer}>Restaurante Vinculado: </Text>
      <View
        style={[
          styles.dropdownPickerEditarUsuarioContainer,
          Platform.OS === "ios" ? { zIndex: 1000 } : null,
        ]}
      >
        <DropDownPicker
          zIndex={1000}
          zIndexInverse={3000}
          style={styles.dropdownPickerEditarUsuario}
          open={openDropDownRestaurantes}
          value={codigoRestauranteSelecionado}
          items={listaRestaurantes}
          setOpen={setOpenDropDownRestaurantes}
          setValue={setCodigoRestauranteSelecionado}
          dropDownContainerStyle={{
            borderColor: "green",
          }}
          placeholder="Selecione o restaurante"
          onChangeValue={() => {
            atualizaRestauranteUsuario();
          }}
        />
      </View>

      {mostrarButtonAutorizarRedefinicaoSenha == true && (
        <TouchableOpacity
          style={styles.confirmaRedefinicaoSenhaContainer}
          onPress={() => {
            autorizaRedefinicaoSenha(2);
          }}
        >
          <Text style={styles.confirmaRedefinicaoSenhaText}>
            Autorizar redefinição de senha
          </Text>
        </TouchableOpacity>
      )}
      {mostrarInputTrocarSenha == true && (
        <View style={{ marginTop: 40, alignItems: "center" }}>
          {/* <Input
            w={{
              base: "95%",
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
                          mostrarSenhaNova ? "visibility-off" : "visibility"
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
            value={senhaNova}
            onChangeText={(text) => setSenhaNova(text)}
            placeholder="Senha Nova"
          />
          <View style={{ marginTop: 10 }}></View>
          <Input
            w={{
              base: "95%",
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
            value={senhaNovaConfirmacao}
            onChangeText={(text) => setSenhaNovaConfirmacao(text)}
            placeholder="Confirmar Senha Nova"
          />
          {mostrarErroUsuarioSenha && (
            <Box alignItems="center">
              <FormControl isInvalid w="100%">
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  As senhas não estão iguais!
                </FormControl.ErrorMessage>
              </FormControl>
            </Box>
          )} */}
          <TouchableOpacity
            style={[styles.confirmaRedefinicaoSenhaContainer, { width: "40%" }]}
            onPress={() => {
              props.navigation.navigate("RedefinirPropriaSenha", {
                usuario: props.route.params.usuario,
              });
            }}
          >
            <Text style={styles.confirmaRedefinicaoSenhaText}>
              Alterar Senha
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
