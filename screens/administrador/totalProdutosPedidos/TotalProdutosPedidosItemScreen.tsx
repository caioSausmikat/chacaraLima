import React, { useState } from "react";
import { Text, View, TextInput } from "react-native";
import { styles } from "../../../assets/styles/styles";

export default function TotalProdutosPedidosItemScreen(props: any) {
  return (
    <View
      style={[
        styles.listaProdutosRestauranteContainer,
        { width: "92%", alignSelf: "center", justifyContent: "center" },
      ]}
    >
      <View style={[styles.produtosRestauranteContainer, { width: "60%" }]}>
        <Text>{props.itemProduto.nome}</Text>
      </View>
      <View
        style={[
          styles.produtosValorContainer,
          { borderColor: "gray", width: "12%" },
        ]}
      >
        <Text>{props.itemProduto.quantidadeProduto}</Text>
      </View>
    </View>
  );
}
