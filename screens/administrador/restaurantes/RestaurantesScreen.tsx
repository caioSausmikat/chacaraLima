import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Alert,
} from "react-native";
import { RootTabScreenProps } from "../../../types";
import { styles } from "../../../assets/styles/styles";
import DropDownPicker from "react-native-dropdown-picker";
import config from "../../../config/config.json";
import { FlatList } from "native-base";
import RestaurantesItemScreen from "./RestaurantesItemScreen";
import { Ionicons } from "@expo/vector-icons";
import capitalize from "../../../functions/capitalize";

interface RestauranteDropdownList {
  label: string;
  value: number;
}

interface ProdutoRestaurante {
  key: string;
  produtoId: number;
  restauranteId: number;
  nome: string;
  valor: number;
}

interface Produto {
  label: string;
  value: number;
}

export default function RestaurantesScreen({
  navigation,
}: RootTabScreenProps<"Restaurantes">) {
  const [openDropDownRestaurantes, setOpenDropDownRestaurantes] =
    useState(false);
  const [openDropDownProdutos, setOpenDropDownProdutos] = useState(false);
  const [atualizaFlatList, setAtualizaFlatList] = useState(false);

  const [mostrarListaRestaurantes, setmostrarListaRestaurantes] =
    useState(false);

  const [mostrarProdutosRestaurante, setMostrarProdutosRestaurante] =
    useState(false);

  const [mostrarListaProdutos, setMostrarListaProdutos] = useState(false);

  const [codigoRestauranteSelecionado, setCodigoRestauranteSelecionado] =
    useState(0);

  let [listaRestaurantes, setListaRestaurantes] = useState<
    RestauranteDropdownList[]
  >([]);

  const [listaProdutosRestaurante, setListaProdutosRestaurante] = useState<
    ProdutoRestaurante[]
  >([]);

  const [listaProdutos, setListaProdutos] = useState<Produto[]>([]);
  const [codigoProdutoSelecionado, setCodigoProdutoSelecionado] = useState(0);
  const [valorProduto, setValorProduto] = useState("");

  useEffect(() => {
    buscarDadosIniciais();
  }, []);

  async function buscarDadosIniciais() {
    try {
      const buscarListaRestaurantesResponse = await buscarListaRestaurantes();
      const jsonBuscarListaRestaurantes =
        await buscarListaRestaurantesResponse.json();
      const carregarListaRestauranteResponse = await carregarListaRestaurante(
        jsonBuscarListaRestaurantes
      );

      const buscarListaProdutosRestauranteSelecionadoResponse =
        await buscarListaProdutosRestauranteSelecionado(
          carregarListaRestauranteResponse
        );
      const jsonBuscarListaProdutosRestauranteSelecionado =
        await buscarListaProdutosRestauranteSelecionadoResponse.json();

      const listaProdutosRestauranteResponse =
        await carregaListaProdutosRestauranteSelecionado(
          jsonBuscarListaProdutosRestauranteSelecionado
        );

      const buscarListaProdutosResponse = await buscarListaProdutos(
        listaProdutosRestauranteResponse
      );
      const jsonBuscarListaProdutos = await buscarListaProdutosResponse.json();
      setMostrarProdutosRestaurante(
        await carregarListaProdutos(
          jsonBuscarListaProdutos,
          listaProdutosRestauranteResponse
        )
      );
    } catch (error) {
      console.log({ error });
    }
  }

  async function atualizaProdutosRestaurante(restauranteId: number) {
    const buscarListaProdutosRestauranteSelecionadoResponse =
      await buscarListaProdutosRestauranteSelecionado(restauranteId);
    const jsonBuscarListaProdutosRestauranteSelecionado =
      await buscarListaProdutosRestauranteSelecionadoResponse.json();
    const listaProdutosRestauranteResponse =
      await carregaListaProdutosRestauranteSelecionado(
        jsonBuscarListaProdutosRestauranteSelecionado
      );
    const buscarListaProdutosResponse = await buscarListaProdutos(
      listaProdutosRestauranteResponse
    );
    const jsonBuscarListaProdutos = await buscarListaProdutosResponse.json();
    setMostrarProdutosRestaurante(
      await carregarListaProdutos(
        jsonBuscarListaProdutos,
        listaProdutosRestauranteResponse
      )
    );
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

  function carregarListaRestaurante(json: any) {
    if (json.length > 0) {
      setmostrarListaRestaurantes(true);
      listaRestaurantes.length = 0;
      for (const item of json) {
        listaRestaurantes.push({
          label: capitalize(item.nome),
          value: item.id,
        });
      }
      setCodigoRestauranteSelecionado(listaRestaurantes[0].value);
      return listaRestaurantes[0].value;
    } else {
      setmostrarListaRestaurantes(false);
      return [];
    }
  }

  //Busca lista de produtos de restaurante selecionado
  function buscarListaProdutosRestauranteSelecionado(restauranteId: number) {
    return fetch(`${config.urlRoot}listaProdutosRestaurante`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ codigoRestaurante: restauranteId }),
    });
  }

  function carregaListaProdutosRestauranteSelecionado(json: any) {
    listaProdutosRestaurante.length = 0;
    for (const item of json) {
      listaProdutosRestaurante.push({
        key: `${item.restauranteId}${item.produtoId}`,
        produtoId: item.produtoId,
        restauranteId: item.restauranteId,
        nome: capitalize(item.Produto.nome),
        valor: item.valor.toFixed(2).replace(".", ","),
      });
    }

    return listaProdutosRestaurante;
  }

  //Busca lista de produtos
  function buscarListaProdutos(
    listaProdutosRestauranteResponse: ProdutoRestaurante[]
  ) {
    return fetch(`${config.urlRoot}listaProdutos`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
  }

  function carregarListaProdutos(
    listaProdutosJson: any,
    listaProdutosRestaurante: ProdutoRestaurante[]
  ) {
    listaProdutos.length = 0;
    let quantidadeProdutosEncontrados = 0;
    for (const produto of listaProdutosJson) {
      quantidadeProdutosEncontrados = 0;
      for (const produtoRestaurante of listaProdutosRestaurante) {
        if (produto.id === produtoRestaurante.produtoId)
          quantidadeProdutosEncontrados++;
      }
      if (quantidadeProdutosEncontrados === 0)
        listaProdutos.push({
          label: capitalize(produto.nome),
          value: produto.id,
        });
    }

    setAtualizaFlatList(!atualizaFlatList);

    if (listaProdutos.length > 0) {
      setMostrarListaProdutos(true);
      setCodigoProdutoSelecionado(listaProdutos[0].value);
    } else {
      setMostrarListaProdutos(false);
    }
    if (listaProdutosRestaurante.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  function excluirProdutoConfirmacao(
    restauranteId: number,
    produtoId: number,
    nome: string
  ) {
    Alert.alert(`Você tem certeza que deseja excluir ${nome}?`, "", [
      {
        text: "Não",
      },
      {
        text: "Sim",
        onPress: () => {
          excluiProdutoHandler(restauranteId, produtoId);
        },
      },
    ]);
  }

  async function excluiProdutoHandler(
    restauranteId: number,
    produtoId: number
  ) {
    let response = await fetch(config.urlRoot + "excluirProdutoRestaurante", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        restauranteId: restauranteId,
        produtoId: produtoId,
      }),
    });
    let excluidoSucesso = await response.json();
    if (excluidoSucesso) {
      atualizaProdutosRestaurante(restauranteId);
    }
  }

  async function alteraProdutoHandler(
    restauranteId: number,
    produtoId: number,
    valor: number,
    valorNovo: string
  ) {
    const valorNovoConvertido = Number(valorNovo.replace(",", "."));
    if (valor !== valorNovoConvertido) {
      let response = await fetch(
        config.urlRoot + "atualizaValorProdutoRestaurante",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restauranteId: restauranteId,
            produtoId: produtoId,
            valor: valorNovoConvertido,
          }),
        }
      );
      let atualizadoSucesso = await response.json();
      if (atualizadoSucesso) {
        atualizaProdutosRestaurante(restauranteId);
      }
    }
  }

  async function incluiProdutoRestauranteHandler(
    restauranteId: number,
    produtoId: number,
    valor: string
  ) {
    const valorNovoConvertido = Number(valor.replace(",", "."));
    let response = await fetch(config.urlRoot + "incluirProdutoRestaurante", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        restauranteId: restauranteId,
        produtoId: produtoId,
        valor: valorNovoConvertido,
      }),
    });
    let incluidoSucesso = await response.json();
    if (incluidoSucesso) {
      atualizaProdutosRestaurante(restauranteId);
      Keyboard.dismiss();
      setCodigoProdutoSelecionado(0);
      setValorProduto("");
      Alert.alert("Produto incluído com sucesso!");
    }
  }

  const valorInputHandler = (valor: string) => {
    setValorProduto(valor);
  };

  return (
    <View style={styles.container}>
      {mostrarListaRestaurantes == true && (
        <View style={styles.dropdownPickerRestauranteContainer}>
          <DropDownPicker
            zIndex={3000}
            zIndexInverse={3000}
            style={styles.dropdownPickerRestauranteStyle}
            open={openDropDownRestaurantes}
            value={codigoRestauranteSelecionado}
            items={listaRestaurantes}
            setOpen={setOpenDropDownRestaurantes}
            setValue={setCodigoRestauranteSelecionado}
            placeholder="Selecione o restaurante"
            dropDownContainerStyle={{
              borderColor: "green",
            }}
            onChangeValue={() => {
              atualizaProdutosRestaurante(codigoRestauranteSelecionado);
            }}
          />
        </View>
      )}
      {/* {mostrarProdutosRestaurante == true && ( */}
      <ScrollView contentContainerStyle={{ width: "92%", alignSelf: "center" }}>
        <FlatList
          data={listaProdutosRestaurante}
          extraData={atualizaFlatList}
          renderItem={(itemData) => (
            <RestaurantesItemScreen
              itemProduto={itemData.item}
              onDelete={excluirProdutoConfirmacao}
              onUpdate={alteraProdutoHandler}
            />
          )}
        />
      </ScrollView>
      {/* )} */}
      {mostrarListaRestaurantes == true && mostrarListaProdutos == true && (
        <View style={styles.dropdownPickerAdcionarProdutosContainer}>
          <View style={styles.dropdownPickerAdcionarProdutos}>
            <DropDownPicker
              zIndex={2000}
              zIndexInverse={4000}
              dropDownDirection="TOP"
              style={styles.dropdownPickerProdutos}
              open={openDropDownProdutos}
              value={codigoProdutoSelecionado}
              items={listaProdutos}
              setOpen={setOpenDropDownProdutos}
              setValue={setCodigoProdutoSelecionado}
              placeholder="Selecione o produto"
              dropDownContainerStyle={{
                borderColor: "green",
              }}
            />
          </View>

          <View style={styles.adicionarProdutoValorContainer}>
            <TextInput
              placeholder="R$"
              value={valorProduto}
              maxLength={6}
              keyboardType="decimal-pad"
              onChangeText={valorInputHandler}
            />
          </View>

          <TouchableOpacity
            style={styles.listaProdutosIconeExcluir}
            onPress={() => {
              incluiProdutoRestauranteHandler(
                codigoRestauranteSelecionado,
                codigoProdutoSelecionado,
                valorProduto
              );
            }}
          >
            <Ionicons name="ios-add-circle" size={40} color="green" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
