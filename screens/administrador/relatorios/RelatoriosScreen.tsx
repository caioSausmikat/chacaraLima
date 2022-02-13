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
import RelatoriosItemScreen from "./RelatoriosItemScreen";
import capitalize from "../../../functions/capitalize";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import dataBr from "../../../functions/dataBr";
import gerarPedidoExcel from "../../../functions/gerarPedidoExcel";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Sharing from "expo-sharing";
import moment from "moment";

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
  valorProduto: number;
  valorTotalProduto: number;
}

export default function RelatoriosScreen(props: any) {
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

  const [dataInicio, setDataInicio] = useState(
    new Date().toJSON().slice(0, 10)
  );

  const [dataFim, setDataFim] = useState(new Date().toJSON().slice(0, 10));

  const [dateInicio, setDateInicio] = useState(new Date());
  const [dateFim, setDateFim] = useState(new Date());
  const [showDatePickerDataInicio, setShowDatePickerDataInicio] =
    useState(false);
  const [showDatePickerDataFim, setShowDatePickerDataFim] = useState(false);

  const [pedidoDataRestaurante, setPedidoDataRestaurante] = useState(false);

  useEffect(() => {
    buscarDadosIniciais();
  }, []);

  useEffect(() => {
    atualizaProdutosRestaurante(codigoRestauranteSelecionado);
  }, [dataInicio, dataFim]);

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

  //Busca pedido para restaurante e datas selecionadas
  function buscarListaProdutosRestauranteSelecionado(restauranteId: number) {
    return fetch(`${config.urlRoot}geraRelatorio`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        restauranteId: restauranteId,
        dataInicio: dataInicio,
        dataFim: dataFim,
      }),
    });
  }

  function carregaListaProdutosRestauranteSelecionado(json: any) {
    listaProdutosRestaurante.length = 0;

    let quantidadeProdutosPedido = 0;
    for (const item of json) {
      if (item.quantidadeProduto === 0) {
        quantidadeProdutosPedido++;
      }
      listaProdutosRestaurante.push({
        key: `${item.restauranteId}${item.produtoId}${new Date()}`,
        produtoId: item.produtoId,
        restauranteId: item.restauranteId,
        nome: capitalize(item.nome),
        quantidadeProduto: item.quantidadeProduto.toString(),
        valorProduto: item.valorProduto.toFixed(2).toString().replace(".", ","),
        valorTotalProduto: item.valorTotalProduto
          .toFixed(2)
          .toString()
          .replace(".", ","),
      });

      if (quantidadeProdutosPedido === json.length) {
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

  const onChangeDataInicial = (event: Event, selectedDate: Date) => {
    setShowDatePickerDataInicio(Platform.OS === "ios");

    if (selectedDate) {
      setDataInicio(selectedDate.toJSON().slice(0, 10));
      setDateInicio(selectedDate || dateInicio);
    }
  };

  const onChangeDataFim = (event: Event, selectedDate: Date) => {
    setShowDatePickerDataFim(Platform.OS === "ios");

    if (selectedDate) {
      setDataFim(selectedDate.toJSON().slice(0, 10));
      setDateFim(selectedDate || dateFim);
    }
  };

  const onPressDataInicioHandler = () => {
    setShowDatePickerDataInicio(!showDatePickerDataInicio);
  };

  const onPressDataFimHandler = () => {
    setShowDatePickerDataFim(!showDatePickerDataFim);
  };

  async function shareExcel() {
    let nomeRestauranteSelecionado = "";
    for (const restaurante of listaRestaurantes) {
      if (restaurante.value === codigoRestauranteSelecionado)
        [(nomeRestauranteSelecionado = restaurante.label)];
    }

    // const shareableExcelUri: string = await gerarPedidoExcel(
    //   pedido,
    //   listaProdutosRestaurante,
    //   nomeRestauranteSelecionado
    // );
    // Sharing.shareAsync(shareableExcelUri, {
    //   mimeType:
    //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Android
    //   dialogTitle: "Your dialog title here", // Android and Web
    //   UTI: "com.microsoft.excel.xlsx", // iOS
    // }).catch((error) => {
    //   console.error("Error", error);
    // });
  }

  return (
    <View style={styles.container}>
      {mostrarListaRestaurantes == true && (
        <View
          style={[
            Platform.OS === "ios"
              ? {
                  zIndex: 3000,
                  flexDirection: "row",
                  marginTop: 40,
                  marginLeft: 15,
                }
              : { flexDirection: "row", marginTop: 40, marginLeft: 15 },
          ]}
        >
          <TouchableOpacity onPress={onPressDataInicioHandler}>
            <View style={styles.pedidosData}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: "#418ac7",
                  alignSelf: "center",
                  fontSize: 14,
                  paddingTop: 6,
                  paddingBottom: 6,
                }}
              >
                {dataBr(dataInicio, "/")}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={onPressDataFimHandler}>
            <View style={styles.pedidosData}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: "#418ac7",
                  alignSelf: "center",
                  fontSize: 14,
                  paddingTop: 6,
                  paddingBottom: 6,
                }}
              >
                {dataBr(dataFim, "/")}
              </Text>
            </View>
          </TouchableOpacity>

          <DropDownPicker
            zIndex={3000}
            style={[
              styles.dropdownPickerPedidosStyle,
              { width: "45%", marginLeft: 5 },
            ]}
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
      )}
      <View>
        {showDatePickerDataInicio == true && (
          <DateTimePicker
            display="default"
            value={dateInicio}
            onChange={onChangeDataInicial}
            textColor="#418ac7"
            maximumDate={moment().subtract(3, "hour").add(1, "days").toDate()}
          />
        )}
        {showDatePickerDataFim == true && (
          <DateTimePicker
            display="default"
            value={dateFim}
            onChange={onChangeDataFim}
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
            <RelatoriosItemScreen itemProduto={itemData.item} />
          )}
        />
      )}

      {/* {pedidoDataRestaurante == true && (
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
      )} */}
    </View>
  );
}
