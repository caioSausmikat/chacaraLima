import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Keyboard,
  Alert,
  Text,
  Platform,
  Image,
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
import gerarPedidoExcel from "../../../functions/gerarPedidoExcel";
import gerarTodosPedidoDataExcel from "../../../functions/gerarTodosPedidoDataExcel";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Sharing from "expo-sharing";
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
    moment().subtract(3, "hour").add(1, "days").toJSON().slice(0, 10)
  );

  const [pedido, setPedido] = useState<Pedido[]>([]);

  const [date, setDate] = useState(
    moment().subtract(3, "hour").add(1, "days").toDate()
  );
  const [show, setShow] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  const [todosPedidos, setTodosPedidos] = useState(false);

  const [expoPushToken, setExpoPushToken] = useState(null);

  const [pedidoDataRestaurante, setPedidoDataRestaurante] = useState(false);

  const [nomeUsuarioPedido, setNomeUsuarioPedido] = useState("");

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", () => {
      setShowButtons(false); // or some other action
    });
    Keyboard.addListener("keyboardDidHide", () => {
      setShowButtons(true); // or some other action
    });

    registerForPushNotificationsAsync();
    buscarDadosIniciais();
  }, []);

  useEffect(() => {
    atualizaProdutosRestaurante(codigoRestauranteSelecionado);
  }, [dataPedido]);

  useEffect(() => {
    if (expoPushToken != null) {
      sendToken();
    }
  }, [expoPushToken]);

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

    let quantidadeProdutosPedido = 0;
    setNomeUsuarioPedido("");
    for (const item of json) {
      if (item.quantidadeProduto > 0) {
        setNomeUsuarioPedido(item.nomeUsuario);
      }

      if (item.quantidadeProduto === 0) {
        quantidadeProdutosPedido++;
      }

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

      if (quantidadeProdutosPedido === json.length) {
        setPedidoDataRestaurante(false);
      } else {
        setPedidoDataRestaurante(true);
      }

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
    let quantidadeProdutosPedido = 0;
    for (const item of pedido) {
      if (item.quantidadeProduto === 0) {
        quantidadeProdutosPedido++;
      }
    }
    if (quantidadeProdutosPedido === pedido.length) {
      setPedidoDataRestaurante(false);
    } else {
      setPedidoDataRestaurante(true);
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

  const onPressTodosPedidosHandler = () => {
    if (todosPedidos == false) {
      setNomeUsuarioPedido("");
    } else {
      atualizaProdutosRestaurante(codigoRestauranteSelecionado);
    }

    setTodosPedidos(!todosPedidos);
  };

  async function shareExcel() {
    let shareableExcelUri = "";
    if (todosPedidos == true) {
      const buscarTodosPedidosDataResponse = await buscarTodosPedidosData();
      const jsonBuscarTodosPedidosDataResponse =
        await buscarTodosPedidosDataResponse.json();

      if (jsonBuscarTodosPedidosDataResponse.length > 0) {
        shareableExcelUri = await gerarTodosPedidoDataExcel(
          jsonBuscarTodosPedidosDataResponse,
          dataBr(dataPedido, "-")
        );
      } else {
        Alert.alert("Nenhum pedido na data selecionada!");
      }
    } else {
      let nomeRestauranteSelecionado = "";
      for (const restaurante of listaRestaurantes) {
        if (restaurante.value === codigoRestauranteSelecionado)
          [(nomeRestauranteSelecionado = restaurante.label)];
      }

      shareableExcelUri = await gerarPedidoExcel(
        pedido,
        listaProdutosRestaurante,
        nomeRestauranteSelecionado
      );
    }

    if (shareableExcelUri !== "") {
      Sharing.shareAsync(shareableExcelUri, {
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Android
        dialogTitle: "Your dialog title here", // Android and Web
        UTI: "com.microsoft.excel.xlsx", // iOS
      }).catch((error) => {
        console.error("Error", error);
      });
    }
  }

  //Busca todos os pedidos de todos os restaurantes na data selecionada
  function buscarTodosPedidosData() {
    return fetch(`${config.urlRoot}geraRecibosPedidosData`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dataPedido: dataPedido,
      }),
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      {pedido.length > 0 && nomeUsuarioPedido !== "" && todosPedidos == false && (
        <View style={{ justifyContent: "center", marginTop: 10 }}>
          <Text
            style={{
              fontWeight: "bold",
              color: "#418ac7",
              alignSelf: "center",
              fontSize: 16,
            }}
          >
            Última modificação feita por {nomeUsuarioPedido}
          </Text>
        </View>
      )}
      {mostrarListaRestaurantes == true && (
        <View
          style={[
            Platform.OS === "ios"
              ? { zIndex: 3000, flexDirection: "row" }
              : { flexDirection: "row" },
            nomeUsuarioPedido !== "" ? { marginTop: 13 } : { marginTop: 40 },
          ]}
        >
          <TouchableOpacity
            style={{ marginLeft: 20 }}
            onPress={onPressTodosPedidosHandler}
          >
            <Ionicons
              style={{ color: "#418ac7" }}
              name={todosPedidos ? "file-tray-full" : "file-tray"}
              size={40}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={onPressDateHandler}>
            <View
              style={[
                styles.pedidosData,
                {
                  borderColor: "green",
                  paddingBottom: "20%",
                  paddingTop: "20%",
                  marginLeft: 5,
                  marginRight: 5,
                },
              ]}
            >
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

          {todosPedidos == false && (
            <DropDownPicker
              zIndex={3000}
              style={[styles.dropdownPickerPedidosStyle, { width: "55%" }]}
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
          )}
          {todosPedidos == true && (
            <View style={[styles.pedidosData, { width: "45%", height: 55 }]}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: "#418ac7",
                  alignSelf: "center",
                  fontSize: 14,
                }}
              >
                Todos os pedidos
              </Text>
            </View>
          )}
        </View>
      )}
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

      {listaProdutosRestaurante.length > 0 && todosPedidos == false && (
        <FlatList
          data={listaProdutosRestaurante}
          extraData={atualizaFlatList}
          removeClippedSubviews={false}
          renderItem={(itemData) => (
            <PedidosItemScreen
              itemProduto={itemData.item}
              onUpdate={atualizaListaProdutosRestaurante}
            />
          )}
        />
      )}

      {showButtons == true && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            height: "15%",
          }}
        >
          {dataPedido ===
            moment().subtract(3, "hour").add(1, "days").toJSON().slice(0, 10) &&
            todosPedidos == false && (
              <TouchableOpacity
                style={[
                  styles.buscaPedidoButton,
                  { backgroundColor: "#4b9666" },
                ]}
                onPress={() => {
                  atualizaProdutosRestaurante(codigoRestauranteSelecionado);
                }}
              >
                <Text style={styles.confirmaRedefinicaoSenhaText}>
                  Buscar Pedido
                </Text>
              </TouchableOpacity>
            )}

          {pedido.length > 0 &&
            pedidoDataRestaurante == true &&
            todosPedidos == false && (
              <TouchableOpacity
                style={styles.gerarExcelButton}
                onPress={() => {
                  shareExcel();
                }}
              >
                <Image
                  style={{ width: 50, height: 50 }}
                  source={require("../../../assets/images/excel.icon.jpg")}
                />
              </TouchableOpacity>
            )}

          {pedido.length > 0 &&
            pedidoDataRestaurante == true &&
            todosPedidos == false && (
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
            )}
        </View>
      )}
      {todosPedidos == true && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            height: "15%",
          }}
        >
          <TouchableOpacity
            style={styles.gerarExcelButton}
            onPress={() => {
              shareExcel();
            }}
          >
            <Image
              style={{ width: 50, height: 50 }}
              source={require("../../../assets/images/excel.icon.jpg")}
            />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
