import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { styles } from "../../../assets/styles/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInputMask } from "react-native-masked-text";

export default function RestaurantesItemScreen(props: any) {
  const [valorProduto, setValorProduto] = useState(
    props.itemProduto.valor.toString()
  );
  const [valorProdutoAnterior, setValorProdutoAnterior] = useState("");

  const valorInputHandler = (valor: string) => {
    setValorProduto(valor);
  };

  return (
    <View
      style={[
        styles.listaProdutosRestauranteContainer,
        { width: "92%", alignSelf: "center" },
      ]}
    >
      <View style={styles.produtosRestauranteContainer}>
        <Text>{props.itemProduto.nome}</Text>
      </View>
      <View style={styles.produtosValorContainer}>
        <TextInputMask
          type={"money"}
          caretHidden={true}
          onFocus={() => {
            setValorProdutoAnterior(valorProduto);
            setValorProduto("");
          }}
          placeholder="R$"
          value={valorProduto}
          maxLength={8}
          keyboardType="numeric"
          onChangeText={valorInputHandler}
          onBlur={() => {
            if (valorProduto == "") {
              setValorProduto(valorProdutoAnterior);
            }
          }}
          onEndEditing={props.onUpdate.bind(
            props,
            props.itemProduto.restauranteId,
            props.itemProduto.produtoId,
            props.itemProduto.valor,
            valorProduto.replace("R$", "")
          )}
        />
      </View>
      <TouchableOpacity
        style={styles.listaProdutosIconeExcluir}
        onPress={props.onDelete.bind(
          props,
          props.itemProduto.restauranteId,
          props.itemProduto.produtoId,
          props.itemProduto.nome
        )}
      >
        <MaterialCommunityIcons name="delete" size={25} color="gray" />
      </TouchableOpacity>
    </View>
  );
}
