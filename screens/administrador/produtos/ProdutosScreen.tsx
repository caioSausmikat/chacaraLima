import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
  Platform,
} from "react-native";
import { RootTabScreenProps } from "../../../types";
import { styles } from "../../../assets/styles/styles";
import config from "../../../config/config.json";
import { FlatList } from "native-base";
import ProdutosItemScreen from "./ProdutosItemScreen";
import { Ionicons } from "@expo/vector-icons";
import capitalize from "../../../functions/capitalize";
import { color } from "native-base/lib/typescript/theme/styled-system";

interface Produto {
  produtoId: number;
  nome: string;
  ativo: number;
}

export default function ProdutosScreen({
  navigation,
}: RootTabScreenProps<"Produtos">) {
  const [mostrarProdutos, setMostrarProdutos] = useState(false);
  const [atualizaFlatList, setAtualizaFlatList] = useState(false);
  const [nomeProduto, setNomeProduto] = useState("");

  const [listaProdutos, setListaProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    buscarDadosBase();
  }, []);

  async function buscarDadosBase() {
    try {
      const buscarListaProdutosResponse = await buscarListaProdutos();
      const jsonBuscarListaProdutos = await buscarListaProdutosResponse.json();
      setMostrarProdutos(await carregarListaProdutos(jsonBuscarListaProdutos));
    } catch (error) {
      console.log({ error });
    }
  }

  //Busca lista de produtos
  function buscarListaProdutos() {
    return fetch(`${config.urlRoot}listaProdutos`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
  }

  function carregarListaProdutos(listaProdutosJson: any) {
    listaProdutos.length = 0;
    for (const produto of listaProdutosJson) {
      listaProdutos.push({
        produtoId: produto.id,
        nome: capitalize(produto.nome),
        ativo: produto.ativo,
      });
    }

    setAtualizaFlatList(!atualizaFlatList);

    if (listaProdutos.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  function excluirProdutoConfirmacao(produtoId: number, nome: string) {
    Alert.alert(`Você tem certeza que deseja excluir ${nome}?`, "", [
      {
        text: "Não",
      },
      {
        text: "Sim",
        onPress: () => {
          excluirProdutoHandler(produtoId);
        },
      },
    ]);
  }

  async function excluirProdutoHandler(produtoId: number) {
    let response = await fetch(config.urlRoot + "desativarProduto", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: produtoId,
      }),
    });
    let excluidoSucesso = await response.json();
    if (excluidoSucesso) {
      buscarDadosBase();
    }
  }

  async function alterarProdutoHandler(
    produtoId: number,
    nome: string,
    novoNome: string
  ) {
    if (nome !== novoNome) {
      let response = await fetch(config.urlRoot + "atualizaNomeProduto", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: produtoId,
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

  async function incluiProdutoHandler(nome: string) {
    if (nome != "") {
      let response = await fetch(config.urlRoot + "incluirProduto", {
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
        Alert.alert("Produto incluído com sucesso!");
        buscarDadosBase();
        Keyboard.dismiss();
        setNomeProduto("");
      }
    }
  }

  const nomeInputHandler = (nome: string) => {
    setNomeProduto(nome);
  };

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 40 }}></View>
      {mostrarProdutos == true && (
        <FlatList
          data={listaProdutos}
          keyExtractor={(item) => item.produtoId.toString()}
          extraData={atualizaFlatList}
          renderItem={(itemData) => (
            <ProdutosItemScreen
              itemProduto={itemData.item}
              onDelete={excluirProdutoConfirmacao}
              onUpdate={alterarProdutoHandler}
            />
          )}
        />
      )}
      <View style={[styles.incluirProdutoContainer]}>
        <View style={styles.adicionarProdutoContainer}>
          <TextInput
            value={nomeProduto}
            placeholder="Adicionar produto"
            onChangeText={nomeInputHandler}
            placeholderTextColor="gray"
          />
        </View>

        <TouchableOpacity
          style={styles.listaProdutosIconeExcluir}
          onPress={() => {
            incluiProdutoHandler(nomeProduto);
          }}
        >
          <Ionicons name="ios-add-circle" size={40} color="green" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
