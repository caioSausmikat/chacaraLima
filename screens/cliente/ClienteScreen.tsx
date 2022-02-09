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
import DropDownPicker from "react-native-dropdown-picker";
import config from "../../config/config.json";
import { FlatList } from "native-base";
import ClienteItemScreen from "./ClienteItemScreen";
import capitalize from "../../functions/capitalize";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import dataBr from "../../functions/dataBr";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

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
  const [showButtons, setShowButtons] = useState(true);

  const [
    mostraMensagemClienteSemRestauranteVinculado,
    setMostraMensagemClienteSemRestauranteVinculado,
  ] = useState(false);

  const [expoPushToken, setExpoPushToken] = useState(null);

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
    console.log("test");
    // registerForPushNotificationsAsync();
    atualizaProdutosRestaurante();
  }, [dataPedido]);

  useEffect(() => {
    if (expoPushToken != null) {
      sendToken();
    }
  }, [expoPushToken]);

  async function buscarDadosIniciais() {
    try {
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

    for (const item of json) {
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

  //Registra o token do usuário
  async function registerForPushNotificationsAsync() {
    let token: any;
    if (Constants.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      setExpoPushToken(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  //Envio do token
  async function sendToken() {
    console.log(expoPushToken);
    console.log(props.route.params.usuarioLogado.id);
    await fetch(config.urlRoot + "token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: expoPushToken,
        usuarioId: props.route.params.usuarioLogado.id,
      }),
    });
  }

  async function salvarPedido() {
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
          marginTop: 20,
          marginBottom: 20,
          justifyContent: "center",
        }}
      >
        <TouchableOpacity onPress={onPressDateHandler}>
          <Ionicons
            style={{ color: "#418ac7", marginLeft: 20 }}
            name="calendar"
            size={40}
            title="Show date picker!"
          />
        </TouchableOpacity>
        <View style={[styles.pedidosData, { width: "35%" }]}>
          <Text
            style={{
              fontWeight: "bold",
              color: "#418ac7",
              alignSelf: "center",
              fontSize: 16,
            }}
          >
            {dataBr(dataPedido)}
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
            maximumDate={new Date()}
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

      {listaProdutosRestaurante.length === 0 && (
        <View style={styles.mensagemSemPedidoContainer}>
          <Text style={styles.mensageSemPedidoText}>
            Nenhum pedido encontrado na data selecionada.
          </Text>
        </View>
      )}

      {showButtons == true && dataPedido === new Date().toJSON().slice(0, 10) && (
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
    </View>
  );
}
