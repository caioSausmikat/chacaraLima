import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Alert,
  Text,
  Platform,
} from "react-native";
import { styles } from "../../../assets/styles/styles";
import DropDownPicker from "react-native-dropdown-picker";
import config from "../../../config/config.json";
import { FlatList } from "native-base";
import PedidosItemScreen from "./PedidosItemScreen";
import capitalize from "../../../functions/capitalize";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import dataBr from "../../../functions/dataBr";

interface RestauranteDropdownList {
  label: string;
  value: number;
}

interface ProdutoRestaurante {
  key: string;
  produtoId: number;
  restauranteId: number;
  nome: string;
  quantidadeProduto: string;
  valor: number;
}

interface Pedido {
  dataPedido: string;
  restauranteId: number;
  usuarioId: number;
  nomeUsuario: string;
  produtoId: number;
  quantidadeProduto: number;
  valorProduto: number;
}

export default function PedidosScreen(props: any) {
  const [openDropDownRestaurantes, setOpenDropDownRestaurantes] =
    useState(false);

  const [atualizaFlatList, setAtualizaFlatList] = useState(false);

  const [mostrarListaRestaurantes, setmostrarListaRestaurantes] =
    useState(false);

  const [mostrarProdutosRestaurante, setMostrarProdutosRestaurante] =
    useState(false);

  const [codigoRestauranteSelecionado, setCodigoRestauranteSelecionado] =
    useState(0);

  let [listaRestaurantes, setListaRestaurantes] = useState<
    RestauranteDropdownList[]
  >([]);

  const [listaProdutosRestaurante, setListaProdutosRestaurante] = useState<
    ProdutoRestaurante[]
  >([]);

  const [dataPedido, setDataPedido] = useState(
    new Date().toJSON().slice(0, 10)
  );

  const [pedido, setPedido] = useState<Pedido[]>([]);

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  useEffect(() => {
    buscarDadosIniciais();
  }, []);

  useEffect(() => {
    atualizaProdutosRestaurante(codigoRestauranteSelecionado);
  }, [dataPedido]);

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

      setMostrarProdutosRestaurante(
        await carregaListaProdutosRestauranteSelecionado(
          jsonBuscarListaProdutosRestauranteSelecionado
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

    setMostrarProdutosRestaurante(
      await carregaListaProdutosRestauranteSelecionado(
        jsonBuscarListaProdutosRestauranteSelecionado
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

  //Busca pedido para restaurante e data selecionados
  function buscarListaProdutosRestauranteSelecionado(restauranteId: number) {
    return fetch(`${config.urlRoot}detalhaPedido`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codigoRestaurante: restauranteId,
        dataPedido: dataPedido,
      }),
    });
  }

  function carregaListaProdutosRestauranteSelecionado(json: any) {
    listaProdutosRestaurante.length = 0;
    pedido.length = 0;

    for (const item of json[0]) {
      listaProdutosRestaurante.push({
        key: `${item.restauranteId}${item.produtoId}${new Date()}`,
        produtoId: item.produtoId,
        restauranteId: item.restauranteId,
        nome: capitalize(item.nome),
        quantidadeProduto: item.quantidadeProduto.toString(),
        valor: item.valorProduto.replace(".", ","),
      });

      pedido.push({
        dataPedido: dataPedido,
        restauranteId: item.restauranteId,
        usuarioId: props.route.params.usuarioLogado.id,
        nomeUsuario: props.route.params.usuarioLogado.nome,
        produtoId: item.produtoId,
        quantidadeProduto: item.quantidadeProduto,
        valorProduto: item.valorProduto,
      });
    }

    setAtualizaFlatList(!atualizaFlatList);

    if (listaProdutosRestaurante.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  function atualizaListaProdutosRestaurante(
    restauranteId: number,
    produtoId: number,
    quantidadeProduto: number,
    novaQuantidade: string
  ) {
    console.log("atualiza");
    console.log(novaQuantidade);
    if (quantidadeProduto !== Number(novaQuantidade)) {
      for (const item of pedido) {
        if (
          item.restauranteId === restauranteId &&
          item.produtoId === produtoId
        ) {
          item.quantidadeProduto = Number(novaQuantidade);
        }
      }
    }
  }

  async function salvarPedido() {
    console.log("salva");
    let response = await fetch(config.urlRoot + "salvarPedido", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pedido: pedido,
      }),
    });
    let salvoSucesso = await response.json();
    if (salvoSucesso) {
      atualizaProdutosRestaurante(codigoRestauranteSelecionado);
      Keyboard.dismiss();
      Alert.alert("Pedido salvo com sucesso!");
    }
  }

  const onChangeDate = (event: Event, selectedDate: Date) => {
    setShow(Platform.OS === "ios");

    if (selectedDate) {
      setDataPedido(selectedDate.toJSON().slice(0, 10));
      setDate(selectedDate || date);
    }
  };

  const onPressDateHandler = () => {
    setShow(!show);
  };

  return (
    <View style={styles.container}>
      {mostrarListaRestaurantes == true && (
        <View style={{ flexDirection: "row", marginTop: 40 }}>
          <TouchableOpacity onPress={onPressDateHandler}>
            <Ionicons
              style={{ color: "#418ac7", marginLeft: 20 }}
              name="calendar"
              size={40}
              title="Show date picker!"
            />
          </TouchableOpacity>
          <View style={styles.pedidosData}>
            <Text>{dataBr(dataPedido)}</Text>
          </View>

          <View>
            <DropDownPicker
              zIndex={3000}
              zIndexInverse={3000}
              style={styles.dropdownPickerPedidosStyle}
              open={openDropDownRestaurantes}
              value={codigoRestauranteSelecionado}
              items={listaRestaurantes}
              setOpen={setOpenDropDownRestaurantes}
              setValue={setCodigoRestauranteSelecionado}
              placeholder="Selecione o restaurante"
              dropDownContainerStyle={{
                borderColor: "green",
                width: "55%",
              }}
              onChangeValue={() => {
                atualizaProdutosRestaurante(codigoRestauranteSelecionado);
              }}
            />
          </View>
        </View>
      )}
      <View>
        {show == true && (
          <DateTimePicker
            display="default"
            value={date}
            onChange={onChangeDate}
            textColor="#418ac7"
            maximumDate={new Date()}
          />
        )}
      </View>

      <ScrollView contentContainerStyle={{ width: "92%", alignSelf: "center" }}>
        <FlatList
          data={listaProdutosRestaurante}
          extraData={atualizaFlatList}
          renderItem={(itemData) => (
            <PedidosItemScreen
              itemProduto={itemData.item}
              onUpdate={atualizaListaProdutosRestaurante}
            />
          )}
        />
      </ScrollView>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <TouchableOpacity
          style={[
            styles.confirmaRedefinicaoSenhaContainer,
            {
              width: "30%",
              marginBottom: 10,
              marginRight: 5,
              backgroundColor: "#4b9666",
            },
          ]}
          onPress={() => {
            atualizaProdutosRestaurante(codigoRestauranteSelecionado);
          }}
        >
          <Text style={styles.confirmaRedefinicaoSenhaText}>Buscar Pedido</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.confirmaRedefinicaoSenhaContainer,
            { width: "30%", marginBottom: 10 },
          ]}
          onPress={() => {
            salvarPedido();
          }}
        >
          <Text style={styles.confirmaRedefinicaoSenhaText}>Salvar Pedido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
