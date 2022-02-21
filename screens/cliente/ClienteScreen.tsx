import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Keyboard,
  Alert,
  Text,
  Platform,
} from "react-native";
import { styles } from "../../assets/styles/styles";
import config from "../../config/config.json";
import { FlatList } from "native-base";
import ClienteItemScreen from "./ClienteItemScreen";
import capitalize from "../../functions/capitalize";
import DateTimePicker from "@react-native-community/datetimepicker";
import dataBr from "../../functions/dataBr";
import moment from "moment";
import { SafeAreaView } from "react-native-safe-area-context";

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

export default function ClienteScreen(props: any) {
  const [atualizaFlatList, setAtualizaFlatList] = useState(false);
  const [nomeRestaurante, setNomeRestaurante] = useState("");

  const [mostrarProdutosRestaurante, setMostrarProdutosRestaurante] =
    useState(false);

  const [listaProdutosRestaurante, setListaProdutosRestaurante] = useState<
    ProdutoRestaurante[]
  >([]);

  const [dataPedido, setDataPedido] = useState(
    moment().subtract(3, "hour").add(1, "days").toJSON().slice(0, 10)
  );

  const [pedido, setPedido] = useState<Pedido[]>([]);

  const [date, setDate] = useState(
    moment().subtract(3, "hour").add(1, "days").toDate()
  );
  const [show, setShow] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  const [pedidoDataRestaurante, setPedidoDataRestaurante] = useState(false);

  const [
    mostraMensagemClienteSemRestauranteVinculado,
    setMostraMensagemClienteSemRestauranteVinculado,
  ] = useState(false);

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", () => {
      setShowButtons(false); // or some other action
    });
    Keyboard.addListener("keyboardDidHide", () => {
      setShowButtons(true); // or some other action
    });

    if (props.route.params.usuarioLogado.restaurantesId > 0) {
      setMostraMensagemClienteSemRestauranteVinculado(false);
      buscarDadosIniciais();
    } else {
      setMostraMensagemClienteSemRestauranteVinculado(true);
    }
  }, []);

  useEffect(() => {
    atualizaProdutosRestaurante();
  }, [dataPedido]);

  async function buscarDadosIniciais() {
    try {
      const buscaDadosRestauranteResponse = await buscaDadosRestaurante(
        props.route.params.usuarioLogado.restaurantesId
      );
      const jsonBuscaDadosRestauranteResponse =
        await buscaDadosRestauranteResponse.json();
      setNomeRestaurante(await jsonBuscaDadosRestauranteResponse.nome);

      const buscarListaProdutosRestauranteSelecionadoResponse =
        await buscarListaProdutosRestauranteSelecionado();
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

  async function atualizaProdutosRestaurante() {
    const buscarListaProdutosRestauranteSelecionadoResponse =
      await buscarListaProdutosRestauranteSelecionado();

    const jsonBuscarListaProdutosRestauranteSelecionado =
      await buscarListaProdutosRestauranteSelecionadoResponse.json();

    setMostrarProdutosRestaurante(
      await carregaListaProdutosRestauranteSelecionado(
        jsonBuscarListaProdutosRestauranteSelecionado
      )
    );
  }

  //Busca pedido para restaurante e data selecionados
  function buscarListaProdutosRestauranteSelecionado() {
    return fetch(`${config.urlRoot}detalhaPedido`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codigoRestaurante: props.route.params.usuarioLogado.restaurantesId,
        dataPedido: dataPedido,
      }),
    });
  }

  function carregaListaProdutosRestauranteSelecionado(json: any) {
    listaProdutosRestaurante.length = 0;
    pedido.length = 0;

    let quantidadeProdutosPedido = 0;
    for (const item of json) {
      if (item.quantidadeProduto === 0) {
        quantidadeProdutosPedido++;
      }
      if (
        dataPedido ===
        moment().subtract(3, "hour").add(1, "days").toJSON().slice(0, 10)
      ) {
        listaProdutosRestaurante.push({
          key: `${item.restauranteId}${item.produtoId}${moment().subtract(
            3,
            "hour"
          )}`,
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
      } else {
        if (item.quantidadeProduto > 0) {
          listaProdutosRestaurante.push({
            key: `${item.restauranteId}${item.produtoId}${moment().subtract(
              3,
              "hour"
            )}`,
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
      }

      if (quantidadeProdutosPedido === json.length) {
        if (
          dataPedido !==
          moment().subtract(3, "hour").add(1, "days").toJSON().slice(0, 10)
        ) {
          listaProdutosRestaurante.length = 0;
          pedido.length = 0;
        }
        setPedidoDataRestaurante(false);
      } else {
        setPedidoDataRestaurante(true);
      }
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
    if (pedido.length > 0) {
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
        atualizaProdutosRestaurante();
        Keyboard.dismiss();
        Alert.alert("Pedido salvo com sucesso!");
        enviarTokenPedidoRealizado();
      }
    }
  }

  async function enviarTokenPedidoRealizado() {
    const buscaDadosRestauranteResponse = await buscaDadosRestaurante(
      pedido[0].restauranteId
    );
    const jsonBuscaDadosRestauranteResponse =
      await buscaDadosRestauranteResponse.json();

    const buscaTokensResponsaveisResponse = await buscaTokensResponsaveis(
      jsonBuscaDadosRestauranteResponse
    );
    const jsonBuscaTokensResponsaveisResponse =
      await buscaTokensResponsaveisResponse.json();

    await enviaNotificacao(
      jsonBuscaDadosRestauranteResponse.nome,
      jsonBuscaTokensResponsaveisResponse
    );
  }

  function buscaDadosRestaurante(restauranteId: number) {
    return fetch(config.urlRoot + "buscaDadosRestaurante", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ restauranteId: restauranteId }),
    });
  }

  function buscaTokensResponsaveis(buscaDadosRestauranteResponse: any) {
    return fetch(config.urlRoot + "buscaTokensResponsaveis", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
  }

  function enviaNotificacao(nomeRestaurante: any, tokens: any) {
    for (const item of tokens) {
      fetch(config.urlRoot + "notifications", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient: item.token,
          title: "Pedido",
          message: `${pedido[0].nomeUsuario} fez um pedido do restaurante ${nomeRestaurante}`,
        }),
      });
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
    <SafeAreaView style={styles.container}>
      {mostraMensagemClienteSemRestauranteVinculado == true && (
        <View style={styles.mensagemSemPedidoContainer}>
          <Text style={styles.mensageSemPedidoText}>
            O seu cadastro não está completo, favor entrar em contato com o
            administrador do sistema.
          </Text>
        </View>
      )}

      <View
        style={{
          flexDirection: "row",
          marginTop: 40,
          marginBottom: 20,
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          onPress={onPressDateHandler}
          style={[styles.pedidosData, { width: "25%" }]}
        >
          <View>
            <Text
              style={{
                fontWeight: "bold",
                color: "#418ac7",
                alignSelf: "center",
                fontSize: 14,
              }}
            >
              {dataBr(dataPedido, "/")}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={[styles.pedidosData, { width: "60%" }]}>
          <Text
            style={{
              fontWeight: "bold",
              color: "#418ac7",
              alignSelf: "center",
              fontSize: 14,
            }}
          >
            {nomeRestaurante}
          </Text>
        </View>
      </View>

      <View>
        {show == true && (
          <DateTimePicker
            display="default"
            value={date}
            onChange={onChangeDate}
            textColor="#418ac7"
            maximumDate={moment().subtract(3, "hour").add(1, "days").toDate()}
          />
        )}
      </View>

      {listaProdutosRestaurante.length > 0 && (
        <FlatList
          data={listaProdutosRestaurante}
          extraData={atualizaFlatList}
          removeClippedSubviews={false}
          renderItem={(itemData) => (
            <ClienteItemScreen
              dataPedido={dataPedido}
              itemProduto={itemData.item}
              onUpdate={atualizaListaProdutosRestaurante}
            />
          )}
        />
      )}

      {listaProdutosRestaurante.length === 0 && pedidoDataRestaurante == false && (
        <View style={styles.mensagemSemPedidoContainer}>
          <Text style={styles.mensageSemPedidoText}>
            Nenhum pedido encontrado na data selecionada.
          </Text>
        </View>
      )}

      {showButtons == true &&
        dataPedido ===
          moment().subtract(3, "hour").add(1, "days").toJSON().slice(0, 10) && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              height: "15%",
            }}
          >
            <TouchableOpacity
              style={styles.buscaPedidoButton}
              onPress={() => {
                salvarPedido();
              }}
            >
              <Text style={styles.confirmaRedefinicaoSenhaText}>
                Salvar Pedido
              </Text>
            </TouchableOpacity>
          </View>
        )}
    </SafeAreaView>
  );
}
