import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
} from "react-native";
import { styles } from "../../../assets/styles/styles";
import config from "../../../config/config.json";
import { FlatList } from "native-base";
import UsuariosItemScreen from "./UsuariosItemScreen";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface Usuario {
  usuarioId: number;
  usuario: string;
  nome: string;
  tipoUsuario: number;
  restauranteId: number;
  indicadorAlteracaoSenha: number;
  ativo: number;
}

export default function UsuariosScreen(props: any) {
  const [mostrarUsuarios, setMostrarUsuarios] = useState(false);
  const [atualizaFlatList, setAtualizaFlatList] = useState(false);
  const [usuario, setUsuario] = useState("");

  const [listaUsuarios, setListaUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    buscarDadosBase();
  }, []);

  async function buscarDadosBase() {
    try {
      const buscarListaUsuariosResponse = await buscarListaUsuarios();
      const jsonBuscarListaUsuarios = await buscarListaUsuariosResponse.json();
      setMostrarUsuarios(await carregarListaUsuarios(jsonBuscarListaUsuarios));
    } catch (error) {
      console.log({ error });
    }
  }

  //Busca lista de usuarios
  function buscarListaUsuarios() {
    return fetch(`${config.urlRoot}listaUsuarios`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
  }

  function carregarListaUsuarios(listaUsuariosJson: any) {
    listaUsuarios.length = 0;
    for (const element of listaUsuariosJson) {
      listaUsuarios.push({
        usuarioId: element.id,
        usuario: element.usuario,
        nome: element.nome,
        tipoUsuario: element.tiposUsuariosId,
        restauranteId: element.restaurantesId,
        indicadorAlteracaoSenha: element.indicadorAlteracaoSenha,
        ativo: element.ativo,
      });
    }

    setAtualizaFlatList(!atualizaFlatList);

    if (listaUsuarios.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  function excluirUsuarioConfirmacao(usuarioId: number, usuario: string) {
    Alert.alert(`Você tem certeza que deseja excluir ${usuario}?`, "", [
      {
        text: "Não",
      },
      {
        text: "Sim",
        onPress: () => {
          excluirUsuarioHandler(usuarioId);
        },
      },
    ]);
  }

  async function excluirUsuarioHandler(usuarioId: number) {
    let response = await fetch(config.urlRoot + "excluirUsuario", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: usuarioId,
      }),
    });
    let excluidoSucesso = await response.json();
    if (excluidoSucesso) {
      Alert.alert("Usuário excluído com sucesso!");
      buscarDadosBase();
    }
  }

  async function incluiUsuarioHandler(usuario: string) {
    if (usuario != "") {
      let response = await fetch(config.urlRoot + "incluirUsuario", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: usuario.toUpperCase(),
        }),
      });
      let incluidoSucesso = await response.json();
      if (incluidoSucesso) {
        Alert.alert("Usuário incluído com sucesso!");
        buscarDadosBase();
        Keyboard.dismiss();
        setUsuario("");
      } else {
        Alert.alert(
          "O nome de usuário já existe, escolha outro nome de usuário!"
        );
      }
    }
  }

  function editarUsuarioHandler(usuario: Usuario) {
    props.navigation.navigate("EditarUsuario", {
      usuario: usuario,
      usuarioLogado: props.route.params.usuarioLogado,
    });
  }

  const usuarioInputHandler = (usuario: string) => {
    setUsuario(usuario);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginTop: 40 }}></View>
      {mostrarUsuarios == true && (
        <FlatList
          data={listaUsuarios}
          keyExtractor={(item) => item.usuarioId.toString()}
          removeClippedSubviews={false}
          extraData={atualizaFlatList}
          renderItem={(itemData) => (
            <UsuariosItemScreen
              itemUsuario={itemData.item}
              onDelete={excluirUsuarioConfirmacao}
              onEdit={editarUsuarioHandler}
            />
          )}
        />
      )}
      <View style={styles.incluirUsuarioContainer}>
        <View style={styles.adicionarUsuarioContainer}>
          <TextInput
            value={usuario}
            placeholder="Adicionar usuário"
            onChangeText={usuarioInputHandler}
            placeholderTextColor="gray"
          />
        </View>

        <TouchableOpacity
          style={styles.listaUsuariosIconeExcluir}
          onPress={() => {
            incluiUsuarioHandler(usuario);
          }}
        >
          <Ionicons name="ios-add-circle" size={40} color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
