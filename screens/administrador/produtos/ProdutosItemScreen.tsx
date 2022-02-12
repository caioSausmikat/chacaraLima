import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { styles } from "../../../assets/styles/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ProdutosItemScreen(props: any) {
  const [nomeProduto, setNomeProduto] = useState(
    props.itemProduto.nome.toString()
  );

  const nomeInputHandler = (valor: string) => {
    setNomeProduto(valor);
  };

  return (
    <View style={styles.listaProdutosRestauranteContainer}>
      <View style={styles.produtosContainer}>
        <TextInput
          value={nomeProduto}
          onChangeText={nomeInputHandler}
          onEndEditing={props.onUpdate.bind(
            props,
            props.itemProduto.produtoId,
            props.itemProduto.nome,
            nomeProduto
          )}
        />
      </View>
      <TouchableOpacity
        style={styles.listaProdutosIconeExcluir}
        onPress={props.onDelete.bind(
          props,
          props.itemProduto.produtoId,
          nomeProduto
        )}
      >
        <MaterialCommunityIcons name="delete" size={25} color="gray" />
      </TouchableOpacity>
    </View>
  );
}
