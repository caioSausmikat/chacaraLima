import React, { useState } from "react";
import { Text, View, TextInput } from "react-native";
import { styles } from "../../../assets/styles/styles";

export default function RelatoriosItemScreen(props: any) {
  const [quantidadeProduto, setQuantidadeProduto] = useState(
    props.itemProduto.quantidadeProduto
  );
  const [valorProduto, setValorProduto] = useState(props.itemProduto.valor);
  const [valorProdutoAnterior, setValorProdutoAnterior] = useState("");

  const quantidadeInputHandler = (valor: string) => {
    setQuantidadeProduto(valor.replace(/[^0-9]/g, ""));
  };

  return (
    <View
      style={[
        styles.listaProdutosRestauranteContainer,
        { width: "92%", alignSelf: "center" },
      ]}
    >
      <View style={[styles.produtosRestauranteContainer, { width: "60%" }]}>
        <Text>{props.itemProduto.nome}</Text>
      </View>
      <View
        style={[
          styles.produtosValorContainer,
          { width: "15%", borderColor: "green" },
        ]}
      >
        <TextInput
          caretHidden={true}
          onFocus={() => {
            setValorProdutoAnterior(quantidadeProduto);
            setQuantidadeProduto("");
          }}
          value={quantidadeProduto}
          maxLength={4}
          keyboardType="number-pad"
          onChangeText={quantidadeInputHandler}
          onBlur={() => {
            if (quantidadeProduto == "") {
              setQuantidadeProduto(valorProdutoAnterior);
            }
          }}
          onEndEditing={props.onUpdate.bind(
            props,
            props.itemProduto.restauranteId,
            props.itemProduto.produtoId,
            props.itemProduto.quantidadeProduto,
            quantidadeProduto
          )}
        />
      </View>
      <View style={[styles.produtosValorContainer, { borderColor: "gray" }]}>
        <Text>R$ {valorProduto}</Text>
      </View>
    </View>
  );
}
