import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { styles } from "../../../assets/styles/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AlterarRestaurantesItemScreen(props: any) {
  const [nomeRestaurante, setNomeRestaurante] = useState(
    props.itemRestaurante.nome.toString()
  );

  const nomeInputHandler = (valor: string) => {
    setNomeRestaurante(valor);
  };

  return (
    <View style={styles.listaProdutosRestauranteContainer}>
      <View style={styles.restaurantesContainer}>
        <TextInput
          value={nomeRestaurante}
          onChangeText={nomeInputHandler}
          onBlur={props.onUpdate.bind(
            props,
            props.itemRestaurante.restauranteId,
            props.itemRestaurante.nome,
            nomeRestaurante
          )}
        />
      </View>
      <TouchableOpacity
        style={styles.listaRestaurantesIconeExcluir}
        onPress={props.onDelete.bind(
          props,
          props.itemRestaurante.restauranteId,
          nomeRestaurante
        )}
      >
        <MaterialCommunityIcons name="delete" size={25} color="gray" />
      </TouchableOpacity>
    </View>
  );
}
