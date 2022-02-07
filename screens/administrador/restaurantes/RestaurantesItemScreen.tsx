import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { styles } from "../../../assets/styles/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function RestaurantesItemScreen(props: any) {
  const [valorProduto, setValorProduto] = useState(
    props.itemProduto.valor.toString()
  );

  const valorInputHandler = (valor: string) => {
    setValorProduto(valor);
  };

  return (
    <View style={styles.listaProdutosRestauranteContainer}>
      <View style={styles.produtosRestauranteContainer}>
        <Text>{props.itemProduto.nome}</Text>
      </View>
      <View style={styles.produtosValorContainer}>
        <TextInput
          placeholder="R$"
          value={valorProduto}
          maxLength={6}
          keyboardType="decimal-pad"
          onChangeText={valorInputHandler}
          onBlur={props.onUpdate.bind(
            props,
            props.itemProduto.restauranteId,
            props.itemProduto.produtoId,
            props.itemProduto.valor,
            valorProduto
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
        <MaterialCommunityIcons name="delete" size={20} color="gray" />
      </TouchableOpacity>
    </View>
  );
}
