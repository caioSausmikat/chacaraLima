import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { RootTabScreenProps } from "../../../types";
import { styles } from "../../../assets/styles/styles";
import config from "../../../config/config.json";
import { FlatList } from "native-base";
import AlterarRestaurantesItemScreen from "./AlterarRestaurantesItemScreen";
import { Ionicons } from "@expo/vector-icons";
import capitalize from "../../../functions/capitalize";

interface Restaurante {
  restauranteId: number;
  nome: string;
  ativo: number;
}

export default function AlterarRestaurantesScreen({
  navigation,
}: RootTabScreenProps<"Restaurantes">) {
  const [mostrarRestaurantes, setMostrarRestaurantes] = useState(false);
  const [atualizaFlatList, setAtualizaFlatList] = useState(false);
  const [nomeRestaurante, setNomeRestaurante] = useState("");

  const [listaRestaurantes, setListaRestaurantes] = useState<Restaurante[]>([]);

  useEffect(() => {
    buscarDadosBase();
  }, []);

  async function buscarDadosBase() {
    try {
      const buscarListaRestaurantesResponse = await buscarListaRestaurantes();
      const jsonBuscarListaRestaurantes =
        await buscarListaRestaurantesResponse.json();
      setMostrarRestaurantes(
        await carregarListaRestaurantes(jsonBuscarListaRestaurantes)
      );
    } catch (error) {
      console.log({ error });
    }
  }

  //Busca lista de restaurantes
  function buscarListaRestaurantes() {
    return fetch(`${config.urlRoot}listaRestaurantes`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
  }

  function carregarListaRestaurantes(listaRestaurantesJson: any) {
    listaRestaurantes.length = 0;
    for (const restaurante of listaRestaurantesJson) {
      listaRestaurantes.push({
        restauranteId: restaurante.id,
        nome: capitalize(restaurante.nome),
        ativo: restaurante.ativo,
      });
    }

    setAtualizaFlatList(!atualizaFlatList);

    if (listaRestaurantes.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  function excluirRestauranteConfirmacao(restauranteId: number, nome: string) {
    Alert.alert(`Você tem certeza que deseja excluir ${nome}?`, "", [
      {
        text: "Não",
      },
      {
        text: "Sim",
        onPress: () => {
          excluirRestauranteHandler(restauranteId);
        },
      },
    ]);
  }

  async function excluirRestauranteHandler(restauranteId: number) {
    let response = await fetch(config.urlRoot + "desativarRestaurante", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: restauranteId,
      }),
    });
    let excluidoSucesso = await response.json();
    if (excluidoSucesso) {
      Alert.alert("Restaurante excluído com sucesso!");
      buscarDadosBase();
    }
  }

  async function alterarRestauranteHandler(
    restauranteId: number,
    nome: string,
    novoNome: string
  ) {
    if (nome !== novoNome) {
      let response = await fetch(config.urlRoot + "atualizaNomeRestaurante", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: restauranteId,
          nome: novoNome.toUpperCase(),
        }),
      });
      let atualizadoSucesso = await response.json();
      if (atualizadoSucesso) {
        buscarDadosBase();
        Keyboard.dismiss();
      }
    }
  }

  async function incluiRestauranteHandler(nome: string) {
    if (nome != "") {
      let response = await fetch(config.urlRoot + "incluirRestaurante", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nome.toUpperCase(),
        }),
      });
      let incluidoSucesso = await response.json();
      if (incluidoSucesso) {
        Alert.alert("Restaurante incluído com sucesso!");
        buscarDadosBase();
        Keyboard.dismiss();
        setNomeRestaurante("");
      }
    }
  }

  const nomeInputHandler = (nome: string) => {
    setNomeRestaurante(nome);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={{ marginTop: 40 }}></View>
      {mostrarRestaurantes == true && (
        <FlatList
          data={listaRestaurantes}
          keyExtractor={(item) => item.restauranteId.toString()}
          extraData={atualizaFlatList}
          renderItem={(itemData) => (
            <AlterarRestaurantesItemScreen
              itemRestaurante={itemData.item}
              onDelete={excluirRestauranteConfirmacao}
              onUpdate={alterarRestauranteHandler}
            />
          )}
        />
      )}
      <View style={styles.incluirRestauranteContainer}>
        <View style={styles.adicionarRestauranteContainer}>
          <TextInput
            value={nomeRestaurante}
            placeholder="Adicionar cliente"
            onChangeText={nomeInputHandler}
            placeholderTextColor="gray"
          />
        </View>

        <TouchableOpacity
          style={styles.listaRestaurantesIconeExcluir}
          onPress={() => {
            incluiRestauranteHandler(nomeRestaurante);
          }}
        >
          <Ionicons name="ios-add-circle" size={40} color="green" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
