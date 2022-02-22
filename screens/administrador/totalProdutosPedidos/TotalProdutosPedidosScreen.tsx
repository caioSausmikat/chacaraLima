import React, { useState, useEffect } from "react";
import { View, Platform } from "react-native";
import { styles } from "../../../assets/styles/styles";
import config from "../../../config/config.json";
import { FlatList } from "native-base";
import TotalProdutosPedidosItemScreen from "./TotalProdutosPedidosItemScreen";
import capitalize from "../../../functions/capitalize";
import moment from "moment";
import { SafeAreaView } from "react-native-safe-area-context";

interface ProdutoPedidos {
  key: string;
  produtoId: number;
  nome: string;
  quantidadeProduto: string;
}

export default function TotalProdutosPedidosScreen(props: any) {
  const [listaProdutosPedidos, setListaProdutosPedidos] = useState<
    ProdutoPedidos[]
  >([]);

  const [atualizaFlatList, setAtualizaFlatList] = useState(false);

  useEffect(() => {
    buscarDadosIniciais();
  }, []);

  async function buscarDadosIniciais() {
    try {
      const buscarListaProdutosPedidosResponse =
        await buscarListaProdutosPedidos();
      const jsonBuscarListaProdutosPedidos =
        await buscarListaProdutosPedidosResponse.json();

      await carregaListaProdutosPedidos(jsonBuscarListaProdutosPedidos);
    } catch (error) {
      console.log({ error });
    }
  }

  //Busca totais de produtos pedidos
  function buscarListaProdutosPedidos() {
    return fetch(`${config.urlRoot}buscaTotalProdutos`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dataPedido: moment()
          .subtract(3, "hour")
          .add(1, "days")
          .toJSON()
          .slice(0, 10),
      }),
    });
  }

  function carregaListaProdutosPedidos(json: any) {
    listaProdutosPedidos.length = 0;
    for (const item of json) {
      listaProdutosPedidos.push({
        key: `${item.restauranteId}${item.produtoId}${new Date()}`,
        produtoId: item.produtoId,
        nome: capitalize(item.nome),
        quantidadeProduto: item.quantidadeProduto.toString(),
      });
    }
    setAtualizaFlatList(!atualizaFlatList);
  }

  return (
    <SafeAreaView style={styles.container}>
      {listaProdutosPedidos.length > 0 && (
        <FlatList
          data={listaProdutosPedidos}
          extraData={atualizaFlatList}
          removeClippedSubviews={false}
          renderItem={(itemData) => (
            <TotalProdutosPedidosItemScreen itemProduto={itemData.item} />
          )}
        />
      )}
    </SafeAreaView>
  );
}
