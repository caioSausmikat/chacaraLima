import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../../../assets/styles/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function UsuariosItemScreen(props: any) {
  return (
    <View style={styles.listaUsuariosRestauranteContainer}>
      <View style={styles.usuariosContainer}>
        <Text>{props.itemUsuario.usuario}</Text>
        {props.itemUsuario.indicadorAlteracaoSenha === 1 && (
          <View style={{ position: "absolute", right: 5, alignSelf: "center" }}>
            <MaterialCommunityIcons name="key" size={15} color="#418ac7" />
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.listaUsuariosIconeExcluir}
        onPress={props.onEdit.bind(props, props.itemUsuario)}
      >
        <MaterialCommunityIcons name="pencil" size={25} color="gray" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.listaUsuariosIconeExcluir}
        onPress={props.onDelete.bind(
          props,
          props.itemUsuario.usuarioId,
          props.itemUsuario.usuario
        )}
      >
        <MaterialCommunityIcons name="delete" size={25} color="gray" />
      </TouchableOpacity>
    </View>
  );
}
