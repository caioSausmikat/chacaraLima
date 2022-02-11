export default function dataBr(data: string, separador: string) {
  var ano = data.split("-")[0];
  var mes = data.split("-")[1];
  var dia = data.split("-")[2];

  return `${dia}${separador}${mes}${separador}${ano}`;
}
