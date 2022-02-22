import React from "react";
// Required to save to cache
import * as FileSystem from "expo-file-system";
// ExcelJS
import ExcelJS from "exceljs";
// From @types/node/buffer
import { Buffer as NodeBuffer } from "buffer";
import dataBr from "./dataBr";
import capitalize from "../functions/capitalize";

// This returns a local uri that can be shared
export default async function gerarRelatorioExcel(
  nomeRestauranteSelecionado: string,
  pedidos: any,
  listaProdutosRestaurante: any,
  dataInicio: string,
  dataFim: string
): Promise<string> {
  const now = new Date();
  let nomeRestauranteSemEspaco = nomeRestauranteSelecionado.replace(/\s/g, "_");
  const fileName = `${nomeRestauranteSemEspaco}_${dataBr(
    dataInicio,
    "-"
  )}_a_${dataBr(dataFim, "-")}.xlsx`;
  const fileUri = FileSystem.cacheDirectory + fileName;

  return new Promise<string>((resolve, reject) => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Me";
    workbook.created = now;
    workbook.modified = now;
    // Add a sheet to work on
    const worksheet = workbook.addWorksheet(nomeRestauranteSelecionado, {});

    worksheet.pageSetup.margins = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      header: 0.8,
      footer: 0.8,
    };

    worksheet.pageSetup.orientation = "landscape";
    worksheet.pageSetup.paperSize = 9;
    worksheet.pageSetup.scale = 89;

    const alfabeto =
      "A;B;C;D;E;F;G;H;I;J;K;L;M;N;O;P;Q;R;S;T;U;V;W;X;Y;Z;AA;AB;AC;AD;AE;AF;AG;AH;AI;AJ;AK;AL;AM;AN;AO;AP;AQ;AR;AS;AT;AU;AV;AW;AX;AY;AZ";
    const arrayAlfabeto = alfabeto.split(";");

    const meses = "Jan;Fev;Mar;Abr;Mai;Jun;Jul;Ago;Set;Out;Nov;Dez";
    const arrayMeses = meses.split(";");

    worksheet.columns = [{ header: "", key: "produto", width: 17.58 }];

    worksheet.addRow({ produto: "" });
    worksheet.addRow({ produto: "" });
    worksheet.addRow({ produto: "" });
    worksheet.addRow({
      produto: `Controle de Vendas CHACARA LIMA ${nomeRestauranteSelecionado}`,
    });

    worksheet.addRow({ produto: "PRODUTO" });
    for (
      let ixPedido = 0;
      ixPedido < listaProdutosRestaurante.length;
      ixPedido++
    ) {
      worksheet.addRow({
        produto: capitalize(listaProdutosRestaurante[ixPedido].Produto.nome),
      });
    }

    worksheet.addRow({ produto: "VALOR:" });

    let pedidosRestaurantes = [];
    let pedidosRestaurantesTemporaria = [];
    for (let item = 0; item < pedidos.length; item++) {
      pedidosRestaurantesTemporaria.push(pedidos[item]);
      if (item < pedidos.length - 1) {
        if (pedidos[item].dataPedido !== pedidos[item + 1].dataPedido) {
          pedidosRestaurantes.push(pedidosRestaurantesTemporaria);
          pedidosRestaurantesTemporaria = [];
        }
      } else {
        if (item === pedidos.length - 1) {
          pedidosRestaurantes.push(pedidosRestaurantesTemporaria);
        }
      }
    }

    worksheet.mergeCells(
      `A5:${arrayAlfabeto[pedidosRestaurantes.length + 2]}5`
    );

    let coluna = 0;
    let quantidadeTotalProduto: number[] = [];
    let valorTotalProduto: number[] = [];
    let valorTotalDia: number[] = [];
    let valorTotalPedido = 0;
    let dataPedido = "";
    let dia = "";
    let mes = 0;
    for (let item = 0; item < pedidosRestaurantes.length; item++) {
      coluna++;
      dia = pedidosRestaurantes[item][0].dataPedido.substring(8, 10);
      mes = pedidosRestaurantes[item][0].dataPedido.substring(5, 7);
      dataPedido = `${dia}/${arrayMeses[mes - 1]}`;
      worksheet.getCell(`${arrayAlfabeto[coluna]}$6`).value = dataPedido;
      valorTotalDia[item] = 0;
      let ixLinha = 0;
      for (
        let ixProduto = 0;
        ixProduto < listaProdutosRestaurante.length;
        ixProduto++
      ) {
        ixLinha = ixProduto + 7;
        let quantidadeProduto = 0;
        let valorProduto = 0;
        for (
          let ixPedido = 0;
          ixPedido < pedidosRestaurantes[item].length;
          ixPedido++
        ) {
          if (
            listaProdutosRestaurante[ixProduto].Produto.nome ===
            pedidosRestaurantes[item][ixPedido].nome
          ) {
            quantidadeProduto =
              pedidosRestaurantes[item][ixPedido].quantidadeProduto;
            valorProduto =
              pedidosRestaurantes[item][ixPedido].valorTotalProduto;
          }
        }
        worksheet.getCell(`${arrayAlfabeto[coluna]}${ixLinha}`).value =
          quantidadeProduto;
        if (item === 0) {
          quantidadeTotalProduto.push(quantidadeProduto);
        } else {
          quantidadeTotalProduto[ixProduto] += quantidadeProduto;
        }
        if (item === 0) {
          valorTotalProduto.push(valorProduto);
        } else {
          valorTotalProduto[ixProduto] += valorProduto;
        }
        valorTotalDia[item] += valorProduto;
      }
      valorTotalPedido += valorTotalDia[item];
      worksheet.getCell(
        `${arrayAlfabeto[coluna]}${listaProdutosRestaurante.length + 7}`
      ).value = valorTotalDia[item];
    }

    coluna++;
    worksheet.getCell(`${arrayAlfabeto[coluna]}6`).value = "Total Unid.";
    for (
      let ixQuantidade = 0;
      ixQuantidade < quantidadeTotalProduto.length;
      ixQuantidade++
    ) {
      worksheet.getCell(`${arrayAlfabeto[coluna]}${ixQuantidade + 7}`).value =
        quantidadeTotalProduto[ixQuantidade];
    }

    coluna++;
    worksheet.getCell(`${arrayAlfabeto[coluna]}6`).value = "Valor Total";

    for (let ixValor = 0; ixValor < valorTotalProduto.length; ixValor++) {
      worksheet.getCell(
        `${arrayAlfabeto[coluna]}${ixValor + 7}`
      ).value = `R$ ${valorTotalProduto[ixValor].toFixed(2).replace(".", ",")}`;
    }

    worksheet.getCell(
      `${arrayAlfabeto[coluna - 1]}${quantidadeTotalProduto.length + 7}`
    ).value = `R$ ${valorTotalPedido.toFixed(2).replace(".", ",")}`;

    worksheet.mergeCells(
      `${arrayAlfabeto[coluna - 1]}${quantidadeTotalProduto.length + 7}:${
        arrayAlfabeto[coluna]
      }${quantidadeTotalProduto.length + 7}`
    );

    // Titulo
    worksheet.getRow(5).font = {
      name: "Arial",
      size: 18,
      bold: true,
    };
    worksheet.getRow(5).alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    // Descrição das colunas
    worksheet.getRow(6).font = {
      name: "Arial",
      size: 11,
      bold: true,
    };
    worksheet.getRow(6).alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    // Nomes dos produtos
    for (let row = 7; row <= quantidadeTotalProduto.length + 7; row++) {
      worksheet.getCell(`${arrayAlfabeto[0]}${row}`).font = {
        name: "Arial",
        size: 11,
      };
      worksheet.getCell(`${arrayAlfabeto[0]}${row}`).alignment = {
        vertical: "middle",
        horizontal: "left",
      };
    }

    // Quantidades de produtos
    for (let row = 7; row <= quantidadeTotalProduto.length + 7; row++) {
      for (let column = 1; column <= pedidosRestaurantes.length + 1; column++) {
        worksheet.getCell(`${arrayAlfabeto[column]}${row}`).font = {
          name: "Arial",
          size: 11,
          bold: true,
        };
        worksheet.getCell(`${arrayAlfabeto[column]}${row}`).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
      }
    }

    // Valor total dos produtos
    for (let row = 7; row <= quantidadeTotalProduto.length + 7; row++) {
      worksheet.getCell(
        `${arrayAlfabeto[pedidosRestaurantes.length + 2]}${row}`
      ).font = {
        name: "Arial",
        size: 11,
        bold: true,
      };
      worksheet.getCell(
        `${arrayAlfabeto[pedidosRestaurantes.length + 2]}${row}`
      ).alignment = {
        vertical: "middle",
        horizontal: "left",
      };
    }

    // VALOR:
    worksheet.getCell(
      `${arrayAlfabeto[0]}${quantidadeTotalProduto.length + 7}`
    ).font = {
      name: "Arial",
      size: 11,
      bold: true,
    };
    worksheet.getCell(
      `${arrayAlfabeto[0]}${quantidadeTotalProduto.length + 7}`
    ).alignment = {
      vertical: "middle",
      horizontal: "left",
    };

    // Valores
    for (let column = 1; column <= pedidosRestaurantes.length + 2; column++) {
      worksheet.getCell(
        `${arrayAlfabeto[column]}${quantidadeTotalProduto.length + 7}`
      ).font = {
        name: "Arial",
        size: 11,
        bold: true,
      };
      worksheet.getCell(
        `${arrayAlfabeto[column]}${quantidadeTotalProduto.length + 7}`
      ).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
    }

    // Pedidos
    for (let column = 1; column <= pedidosRestaurantes.length; column++) {
      worksheet.getColumn(arrayAlfabeto[column]).width = 7.14;
    }

    // Total Unid.
    worksheet.getColumn(
      arrayAlfabeto[pedidosRestaurantes.length + 1]
    ).width = 11.72;

    // Valor Total
    worksheet.getColumn(
      arrayAlfabeto[pedidosRestaurantes.length + 2]
    ).width = 18.58;

    for (let row = 5; row <= quantidadeTotalProduto.length + 7; row++) {
      for (let column = 0; column <= pedidosRestaurantes.length + 2; column++) {
        worksheet.getCell(`${arrayAlfabeto[column]}${row}`).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
    }

    // Write to file
    workbook.xlsx.writeBuffer().then((buffer: ExcelJS.Buffer) => {
      // Do this to use base64 encoding
      const nodeBuffer = NodeBuffer.from(buffer);
      const bufferStr = nodeBuffer.toString("base64");
      FileSystem.writeAsStringAsync(fileUri, bufferStr, {
        encoding: FileSystem.EncodingType.Base64,
      }).then(() => {
        resolve(fileUri);
      });
    });
  });
}
