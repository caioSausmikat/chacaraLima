import React from "react";
// Required to save to cache
import * as FileSystem from "expo-file-system";
// ExcelJS
import ExcelJS from "exceljs";
// From @types/node/buffer
import { Buffer as NodeBuffer } from "buffer";
import dataBr from "../functions/dataBr";

// This returns a local uri that can be shared
export default async function gerarPedidoExcel(pedido: any): Promise<string> {
  // export default async function gerarPedidoExcel(pedido: any, Promise: string) {
  const now = new Date();
  const fileName = "YourFilename.xlsx";
  const fileUri = FileSystem.cacheDirectory + fileName;

  return new Promise<string>((resolve, reject) => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Me";
    workbook.created = now;
    workbook.modified = now;
    // Add a sheet to work on
    const worksheet = workbook.addWorksheet("My Sheet", {});

    worksheet.columns = [
      { header: "Chácara Lima", key: "quantidade", width: 5 },
      { header: "", key: "produto", width: 18 },
      { header: "", key: "valorUnidade", width: 8 },
      { header: "", key: "valorTotalProduto", width: 8 },
    ];

    worksheet.mergeCells("A1:D1");
    worksheet.addRow({ quantidade: "Colônia Agrícola Samambaia Chácara 23" });
    worksheet.mergeCells("A2:D2");
    worksheet.addRow({ quantidade: "Tel. (61) 99983-5779" });
    worksheet.mergeCells("A3:D3");
    worksheet.addRow({ quantidade: "" });
    worksheet.addRow({ quantidade: "" });
    worksheet.addRow({
      quantidade: "Data:",
      produto: dataBr(pedido[0].dataPedido),
    });
    worksheet.addRow({ quantidade: "Ideal" });
    worksheet.mergeCells("A7:D7");
    worksheet.addRow({
      quantidade: "Qt.",
      produto: "Produtos",
      valorUnidade: "Valor U",
      valorTotalProduto: "Total",
    });

    let valorTotal = 0;
    let quantidadeProdutos = 0;
    for (const item of pedido) {
      if (item.quantidadeProduto > 0) {
        quantidadeProdutos++;
        valorTotal += item.quantidadeProduto * item.valorProduto;
        worksheet.addRow({
          quantidade: item.quantidadeProduto,
          produto: item.produtoId,
          valorUnidade: `R$ ${item.valorProduto.replace(".", ",")}`,
          valorTotalProduto: `R$ ${(item.quantidadeProduto * item.valorProduto)
            .toFixed(2)
            .replace(".", ",")}`,
        });
      }
    }

    const quantidadeLinhas = 28 - quantidadeProdutos;
    for (let row = 0; row < quantidadeLinhas; row++) {
      worksheet.addRow({ quantidade: "" });
    }

    worksheet.addRow({
      valorUnidade: "Total",
      valorTotalProduto: `R$ ${valorTotal.toFixed(2).replace(".", ",")}`,
    });

    worksheet.addRow({ quantidade: "" });
    worksheet.addRow({ quantidade: "" });
    worksheet.addRow({
      quantidade: "_________________________",
      produto: "",
      valorUnidade: "_________________________",
      valorTotalProduto: "",
    });
    worksheet.mergeCells("A40:B40");
    worksheet.mergeCells("C40:D40");

    worksheet.addRow({
      quantidade: "Comprador",
      produto: "",
      valorUnidade: "Vendedor",
      valorTotalProduto: "",
    });
    worksheet.mergeCells("A41:B41");
    worksheet.mergeCells("C41:D41");

    worksheet.addRow({ quantidade: "" });
    worksheet.addRow({ quantidade: "" });
    worksheet.addRow({ quantidade: "" });

    worksheet.addRow({ quantidade: "Chácara Lima" });
    worksheet.mergeCells("A45:D45");
    worksheet.addRow({ quantidade: "Colônia Agrícola Samambaia Chácara 23" });
    worksheet.mergeCells("A46:D46");
    worksheet.addRow({ quantidade: "Tel. (61) 99983-5779" });
    worksheet.mergeCells("A47:D47");
    worksheet.addRow({ quantidade: "" });
    worksheet.addRow({ quantidade: "" });
    worksheet.addRow({
      quantidade: "Data:",
      produto: dataBr(pedido[0].dataPedido),
    });
    worksheet.addRow({ quantidade: "Ideal" });
    worksheet.mergeCells("A51:D51");
    worksheet.addRow({
      quantidade: "Qt.",
      produto: "Produtos",
      valorUnidade: "Valor U",
      valorTotalProduto: "Total",
    });

    for (const item of pedido) {
      if (item.quantidadeProduto > 0) {
        worksheet.addRow({
          quantidade: item.quantidadeProduto,
          produto: item.produtoId,
          valorUnidade: `R$ ${item.valorProduto.replace(".", ",")}`,
          valorTotalProduto: `R$ ${(item.quantidadeProduto * item.valorProduto)
            .toFixed(2)
            .replace(".", ",")}`,
        });
      }
    }

    for (let row = 0; row < quantidadeLinhas; row++) {
      worksheet.addRow({ quantidade: "" });
    }

    worksheet.addRow({
      valorUnidade: "Total",
      valorTotalProduto: `R$ ${valorTotal.toFixed(2).replace(".", ",")}`,
    });

    worksheet.addRow({ quantidade: "" });
    worksheet.addRow({ quantidade: "" });
    worksheet.addRow({
      quantidade: "_________________________",
      produto: "",
      valorUnidade: "_________________________",
      valorTotalProduto: "",
    });
    worksheet.mergeCells("A84:B84");
    worksheet.mergeCells("C84:D84");

    worksheet.addRow({
      quantidade: "Comprador",
      produto: "",
      valorUnidade: "Vendedor",
      valorTotalProduto: "",
    });
    worksheet.mergeCells("A85:B85");
    worksheet.mergeCells("C85:D85");

    worksheet.getRow(1).font = {
      name: "Arial",
      size: 11,
      bold: true,
    };
    worksheet.getRow(1).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getRow(2).font = {
      name: "Arial",
      size: 9,
    };
    worksheet.getRow(2).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getRow(3).font = {
      name: "Arial",
      size: 9,
    };
    worksheet.getRow(3).alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    for (let row = 6; row <= 41; row++) {
      worksheet.getRow(row).font = {
        name: "Arial",
        size: 9,
        bold: true,
      };
      worksheet.getRow(row).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
    }

    for (let row = 8; row <= 36; row++) {
      worksheet.getCell(`A${row}`).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }

    for (let row = 8; row <= 36; row++) {
      worksheet.getCell(`B${row}`).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }

    for (let row = 8; row <= 36; row++) {
      worksheet.getCell(`C${row}`).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }

    for (let row = 8; row <= 37; row++) {
      worksheet.getCell(`D${row}`).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }

    worksheet.getRow(45).font = {
      name: "Arial",
      size: 11,
      bold: true,
    };
    worksheet.getRow(45).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getRow(46).font = {
      name: "Arial",
      size: 9,
    };
    worksheet.getRow(46).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getRow(47).font = {
      name: "Arial",
      size: 9,
    };
    worksheet.getRow(47).alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    for (let row = 50; row <= 85; row++) {
      worksheet.getRow(row).font = {
        name: "Arial",
        size: 9,
        bold: true,
      };
      worksheet.getRow(row).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
    }

    for (let row = 52; row <= 80; row++) {
      worksheet.getCell(`A${row}`).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }

    for (let row = 52; row <= 80; row++) {
      worksheet.getCell(`B${row}`).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }

    for (let row = 52; row <= 80; row++) {
      worksheet.getCell(`C${row}`).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }

    for (let row = 52; row <= 81; row++) {
      worksheet.getCell(`D${row}`).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
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
