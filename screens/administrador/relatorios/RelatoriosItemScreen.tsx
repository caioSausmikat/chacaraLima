import React, { useState } from "react";
import { Text, View, TextInput } from "react-native";
import { styles } from "../../../assets/styles/styles";

export default function RelatoriosItemScreen(props: any) {
  return (
    <View
      style={[
        styles.listaProdutosRestauranteContainer,
        { width: "92%", alignSelf: "center" },
      ]}
    >
      <View style={[styles.produtosRestauranteContainer, { width: "45%" }]}>
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
      <View
        style={[
          styles.produtosValorContainer,
          { borderColor: "gray", width: "17%" },
        ]}
      >
        <Text>R$ {props.itemProduto.valorProduto}</Text>
      </View>
      <View style={[styles.produtosValorContainer, { borderColor: "gray" }]}>
        <Text>R$ {props.itemProduto.valorTotalProduto}</Text>
      </View>
    </View>
  );
}
