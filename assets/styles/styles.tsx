import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logomarca: {
    height: 300,
    width: 300,
    alignSelf: "center",
  },
  loginButton: {
    padding: 12,
    marginTop: 40,
  },
  dropdownPickerRestauranteContainer: {
    marginTop: 40,
    width: "95%",
    alignSelf: "center",
  },
  dropdownPickerRestauranteStyle: {
    marginBottom: 5,
    borderColor: "green",
  },
  listaProdutosRestauranteContainer: {
    flexDirection: "row",
  },
  produtosRestauranteContainer: {
    padding: 10,
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 1,
    margin: 3,
    width: "70%",
  },
  produtosValorContainer: {
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 1,
    margin: 3,
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  listaProdutosIconeExcluir: {
    justifyContent: "center",
    marginLeft: 5,
    backgroundColor: "white",
  },
  dropdownPickerAdcionarProdutosContainer: {
    marginLeft: 20,
    flexDirection: "row",
    bottom: 2,
  },
  dropdownPickerAdcionarProdutos: {
    width: "67%",
  },
  dropdownPickerProdutos: {
    borderColor: "green",
  },
  adicionarProdutoValorContainer: {
    borderRadius: 5,
    borderColor: "green",
    borderWidth: 1,
    marginLeft: 6,
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  listaProdutosContainer: {
    marginLeft: 15,
    marginTop: 30,
  },
  produtosContainer: {
    padding: 5,
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 1,
    margin: 5,
    width: "85%",
  },
  adicionarProdutoContainer: {
    borderRadius: 5,
    borderColor: "green",
    borderWidth: 1,
    marginLeft: 10,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  incluirProdutoContainer: {
    marginLeft: 10,
    flexDirection: "row",
    bottom: 3,
    backgroundColor: "white",
  },
  listaRestaurantesContainer: {
    marginLeft: 15,
    marginTop: 30,
  },
  restaurantesContainer: {
    padding: 5,
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 1,
    margin: 5,
    width: "85%",
  },
  adicionarRestauranteContainer: {
    borderRadius: 5,
    borderColor: "green",
    borderWidth: 1,
    marginLeft: 10,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  incluirRestauranteContainer: {
    marginLeft: 15,
    flexDirection: "row",
    bottom: 3,
    backgroundColor: "white",
  },
  listaRestaurantesIconeExcluir: {
    justifyContent: "center",
    marginLeft: 7,
  },

  listaUsuariosContainer: {
    marginLeft: 15,
    marginTop: 40,
  },
  usuariosContainer: {
    padding: 5,
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 1,
    margin: 5,
    width: "80%",
  },
  adicionarUsuarioContainer: {
    borderRadius: 5,
    borderColor: "green",
    borderWidth: 1,
    marginLeft: 10,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  incluirUsuarioContainer: {
    marginLeft: 10,
    flexDirection: "row",
    bottom: 3,
    backgroundColor: "white",
  },
  listaUsuariosIconeExcluir: {
    justifyContent: "center",
    marginLeft: 7,
  },
  listaUsuariosRestauranteContainer: {
    flexDirection: "row",
  },
  editarUsuarioInputContainer: {
    padding: 10,
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 1,
    width: "95%",
    marginLeft: 10,
    marginBottom: 10,
  },
  dropdownPickerEditarUsuarioContainer: {
    marginBottom: 15,
    width: "95%",
    alignSelf: "center",
  },
  dropdownPickerEditarUsuario: {
    borderColor: "gray",
  },
  textFormContainer: {
    textAlign: "center",
  },
  esqueceuSenhaContainer: {
    alignItems: "flex-end",
    marginTop: 5,
    marginRight: 52,
  },
  esqueceuSenhaText: {
    fontSize: 10,
    color: "#5b9cc4",
    fontWeight: "bold",
  },
  redefinirSenhaUsuarioInputContainer: {
    padding: 10,
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 1,
    width: "85%",
    marginLeft: 10,
    marginBottom: 10,
  },
  mensagemSolicitacaoRedefinicaoSenhaContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#83b0be",
    borderRadius: 50,
    margin: 30,
  },
  mensagemSolicitacaoRedefinicaoSenhaText: {
    color: "white",
  },
  confirmaRedefinicaoSenhaContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    padding: 10,
    backgroundColor: "#418ac7",
    borderRadius: 50,
    marginTop: 20,
    width: "60%",
  },
  confirmaRedefinicaoSenhaText: {
    color: "white",
    fontWeight: "bold",
  },
});

export { styles };
