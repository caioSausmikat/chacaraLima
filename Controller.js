const config = require("./config/config.json");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const models = require("./models");
const Sequelize = require("sequelize");
const { Expo } = require("expo-server-sdk");
const { engine } = require("express-handlebars");

const sequelize = new Sequelize(
  config.production.database,
  config.production.username,
  config.production.password,
  {
    host: config.production.host,
    dialect: config.production.dialect,
  }
);

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("assets"));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
let usuarios = models.Usuarios;
let tiposUsuarios = models.TiposUsuarios;
let restaurantes = models.Restaurantes;
let produtosRestaurante = models.ProdutosRestaurante;
let produtos = models.Produtos;
let pedidos = models.Pedidos;
let tokens = models.Tokens;
let expo = new Expo();

app.post("/login", async (req, res) => {
  let response = await usuarios
    .findOne({
      where: { usuario: req.body.usuario, senha: req.body.senha },
    })
    .catch((err) => {
      console.log(err);
    });
  if (response === null) {
    res.send(JSON.stringify("erro"));
  } else {
    res.send(response);
  }
});

app.post("/verificaUsuarioNovo", async (req, res) => {
  let response = await usuarios
    .findOne({
      where: { usuario: req.body.usuario },
    })
    .catch((err) => {
      console.log(err);
    });
  if (response === null) {
    res.send(JSON.stringify("erro"));
  } else {
    res.send(response);
  }
});

app.post("/verifyPass", async (req, res) => {
  let response = await usuarios.findOne({
    where: { id: req.body.id, senha: req.body.senhaAntiga },
  });
  if (response === null) {
    res.send({
      mensagem: JSON.stringify("Senha antiga não confere"),
      erro: true,
    });
  } else {
    if (req.body.novaSenha === req.body.senhaAntiga) {
      response.senha = req.body.novaSenha;
      response.save();
      res.send({
        mensagem: JSON.stringify("Senha nova igual a senha antiga!"),
        erro: true,
      });
    } else {
      if (req.body.novaSenha === req.body.confNovaSenha) {
        response.senha = req.body.novaSenha;
        response.save();
        res.send({
          mensagem: JSON.stringify("Senha atualizada com sucesso!"),
          erro: false,
        });
      } else {
        res.send({
          mensagem: JSON.stringify("Nova senha e confirmação não conferem!"),
          erro: true,
        });
      }
    }
  }
});

//Buscar lista de restaurantes
app.post("/listaRestaurantes", async (req, res) => {
  let response = await restaurantes
    .findAll({ where: { ativo: 1 }, order: [["nome", "ASC"]] })
    .catch((err) => {
      console.log(err);
    });
  res.send(JSON.stringify(response));
});

//Buscar lista de produtos de um restaurante
app.post("/listaProdutosRestaurante", async (req, res) => {
  let response = await produtosRestaurante
    .findAll({
      include: [
        {
          model: produtos,
          as: "produtos",
          where: {
            ativo: 1,
          },
          order: [["produtos", "nome", "ASC"]],
        },
      ],
      where: { restauranteId: req.body.codigoRestaurante },
    })
    .catch((err) => {
      console.log(err);
    });
  res.send(JSON.stringify(response));
});

//Buscar lista de produtos
app.post("/listaProdutos", async (req, res) => {
  let response = await produtos
    .findAll({ where: { ativo: 1 }, order: [["nome", "ASC"]] })
    .catch((err) => {
      console.log(err);
    });
  res.send(JSON.stringify(response));
});

//Atualiza valor de produto de restaurante
app.post("/atualizaValorProdutoRestaurante", async (req, res) => {
  let response = await produtosRestaurante
    .findAll({
      where: {
        restauranteId: req.body.restauranteId,
        produtoId: req.body.produtoId,
      },
      include: [{ all: true }],
    })
    .catch((err) => {
      console.log(err);
    });
  response[0].valor = req.body.valor;
  response[0].updateAt = new Date();
  response[0].save();
  res.send(true);
});

//Exclui produto de restaurante
app.post("/excluirProdutoRestaurante", async (req, res) => {
  let response = await produtosRestaurante
    .destroy({
      where: {
        restauranteId: req.body.restauranteId,
        produtoId: req.body.produtoId,
      },
    })
    .catch((err) => {
      console.log(err);
    });
  if (response === 1) {
    res.send(true);
  }
});

//Inclui produto em restaurante
app.post("/incluirProdutoRestaurante", async (req, res) => {
  let response = await produtosRestaurante
    .create({
      restauranteId: req.body.restauranteId,
      produtoId: req.body.produtoId,
      valor: req.body.valor,
      createdAt: Date(),
      updatedAt: Date(),
    })
    .catch((err) => {
      console.log(err);
    });
  if (response) {
    res.send(true);
  }
});

//Atualiza nome de produto
app.post("/atualizaNomeProduto", async (req, res) => {
  let response = await produtos
    .findAll({
      where: {
        id: req.body.id,
      },
    })
    .catch((err) => {
      console.log(err);
    });
  response[0].nome = req.body.nome;
  response[0].updateAt = new Date();
  response[0].save();
  res.send(true);
});

//Desativa produto
app.post("/desativarProduto", async (req, res) => {
  let response = await produtos
    .findAll({
      where: {
        id: req.body.id,
      },
    })
    .catch((err) => {
      console.log(err);
    });
  response[0].ativo = 0;
  response[0].updateAt = new Date();
  response[0].save();
  res.send(true);
});

//Inclui produto
app.post("/incluirProduto", async (req, res) => {
  let responseFind = await produtos
    .findAll({
      where: {
        nome: req.body.nome,
      },
    })
    .catch((err) => {
      console.log(err);
    });
  if (responseFind[0]) {
    responseFind[0].ativo = 1;
    responseFind[0].updateAt = new Date();
    responseFind[0].save();
    res.send(true);
  } else {
    let response = await produtos
      .create({
        nome: req.body.nome,
        ativo: 1,
        createdAt: Date(),
        updatedAt: Date(),
      })
      .catch((err) => {
        console.log(err);
      });
    if (response) {
      res.send(true);
    }
  }
});

//Atualiza nome de restaurante
app.post("/atualizaNomeRestaurante", async (req, res) => {
  let response = await restaurantes
    .findAll({
      where: {
        id: req.body.id,
      },
    })
    .catch((err) => {
      console.log(err);
    });
  response[0].nome = req.body.nome;
  response[0].updateAt = new Date();
  response[0].save();
  res.send(true);
});

//Desativa restaurante
app.post("/desativarRestaurante", async (req, res) => {
  let response = await restaurantes
    .findAll({
      where: {
        id: req.body.id,
      },
    })
    .catch((err) => {
      console.log(err);
    });
  response[0].ativo = 0;
  response[0].updateAt = new Date();
  response[0].save();
  res.send(true);
});

//Inclui restaurante
app.post("/incluirRestaurante", async (req, res) => {
  let responseFind = await restaurantes
    .findAll({
      where: {
        nome: req.body.nome,
      },
    })
    .catch((err) => {
      console.log(err);
    });
  if (responseFind[0]) {
    responseFind[0].ativo = 1;
    responseFind[0].updateAt = new Date();
    responseFind[0].save();
    res.send(true);
  } else {
    let response = await restaurantes
      .create({
        nome: req.body.nome,
        ativo: 1,
        createdAt: Date(),
        updatedAt: Date(),
      })
      .catch((err) => {
        console.log(err);
      });
    if (response) {
      res.send(true);
    }
  }
});

//Buscar lista de usuarios
app.post("/listaUsuarios", async (req, res) => {
  let response = await usuarios
    .findAll({ order: [["nome", "ASC"]] })
    .catch((err) => {
      console.log(err);
    })
    .catch((err) => {
      console.log(err);
    });
  res.send(JSON.stringify(response));
});

//Atualiza nome de usuario
app.post("/atualizaNomeUsuario", async (req, res) => {
  let response = await usuarios
    .findAll({
      where: {
        id: req.body.id,
      },
    })
    .catch((err) => {
      console.log(err);
    });
  response[0].nome = req.body.nome;
  response[0].updateAt = new Date();
  response[0].save();
  res.send(true);
});

//Exclui usuario
app.post("/excluirUsuario", async (req, res) => {
  let response = await usuarios
    .destroy({
      where: {
        id: req.body.id,
      },
    })
    .catch((err) => {
      console.log(err);
    });
  if (response) {
    res.send(true);
  }
});

//Inclui usuario
app.post("/incluirUsuario", async (req, res) => {
  let response = await usuarios
    .create({
      usuario: req.body.usuario,
      tiposUsuariosId: 3,
      indicadorAlteracaoSenha: 0,
      createdAt: Date(),
      updatedAt: Date(),
    })
    .catch((err) => {
      console.log(err);
    });
  if (response) {
    res.send(true);
  } else {
    res.send(false);
  }
});

//Buscar detalhes usuario
app.post("/detalhaUsuario", async (req, res) => {
  let response = await usuarios
    .findOne({ where: { id: req.body.id } })
    .catch((err) => {
      console.log(err);
    });
  res.send(JSON.stringify(response));
});

//Buscar detalhes usuario a partir do nome de usuario
app.post("/detalhaUsuarioPorNomeUsuario", async (req, res) => {
  let response = await usuarios
    .findOne({ where: { usuario: req.body.usuario } })
    .catch((err) => {
      console.log(err);
    });
  res.send(JSON.stringify(response));
});

//Atualiza usuario
app.post("/atualizaUsuario", async (req, res) => {
  let response = await usuarios
    .findAll({
      where: {
        id: req.body.id,
      },
    })
    .catch((err) => {
      console.log(err);
    });
  response[0].usuario = req.body.usuario;
  response[0].updateAt = new Date();
  response[0].save();
  res.send(true);
});

//Atualiza tipo de usuario
app.post("/atualizaTipoUsuario", async (req, res) => {
  let response = await usuarios
    .findAll({
      where: {
        id: req.body.id,
      },
    })
    .catch((err) => {
      console.log(err);
    });
  response[0].tiposUsuariosId = req.body.tiposUsuariosId;
  response[0].updateAt = new Date();
  response[0].save();
  res.send(true);
});

//Atualiza restaurante vinculado a usuario
app.post("/atualizaRestauranteUsuario", async (req, res) => {
  let response = await usuarios
    .findAll({
      where: {
        id: req.body.id,
      },
    })
    .catch((err) => {
      console.log(err);
    });
  response[0].restaurantesId = req.body.restaurantesId;
  response[0].updateAt = new Date();
  response[0].save();
  res.send(true);
});

//Buscar tipos de usuarios
app.post("/listaTiposUsuarios", async (req, res) => {
  let response = await tiposUsuarios
    .findAll({ order: [["nomeTipo", "ASC"]] })
    .catch((err) => {
      console.log(err);
    });
  res.send(JSON.stringify(response));
});

//Altera indicador de alteração de senha
app.post("/alteraIndicadorAlteracaoSenha", async (req, res) => {
  let response = await usuarios
    .findAll({
      where: {
        usuario: req.body.usuario,
      },
    })
    .catch((err) => {
      console.log(err);
    });
  response[0].indicadorAlteracaoSenha = req.body.indicadorAlteracaoSenha;
  response[0].updateAt = new Date();
  response[0].save();
  res.send(true);
});

//Redefinir senha
app.post("/redefinirSenha", async (req, res) => {
  let verificaSenhaAtualResponse = await usuarios
    .findOne({
      where: {
        usuario: req.body.usuario,
        senha: req.body.senhaAtual,
      },
    })
    .catch((err) => {
      console.log(err);
    });
  if (verificaSenhaAtualResponse === null) {
    res.send(false);
  } else {
    let response = await usuarios
      .findAll({
        where: {
          usuario: req.body.usuario,
        },
      })
      .catch((err) => {
        console.log(err);
      });
    response[0].senha = req.body.senhaNova;
    response[0].updateAt = new Date();
    response[0].save();
    res.send(true);
  }
});

//Criar senha
app.post("/criarSenha", async (req, res) => {
  let response = await usuarios
    .findAll({
      where: {
        usuario: req.body.usuario,
      },
    })
    .catch((err) => {
      console.log(err);
    });
  response[0].senha = req.body.senhaNova;
  response[0].updateAt = new Date();
  response[0].save();
  res.send(true);
});

//Detalha pedido
app.post("/detalhaPedido", async (req, res) => {
  let listaFinalResponse = [];

  const buscaPedidoResponse = await pedidos
    .findAll({
      where: {
        dataPedido: req.body.dataPedido,
        restauranteId: req.body.codigoRestaurante,
      },
    })
    .catch((err) => {
      console.log(err);
    });

  const response = await sequelize.query(
    `SELECT A.restauranteId, A.produtoId, FORMAT(A.valor,2) AS valorProduto, ' ' AS dataPedido, ' ' AS usuarioId, ' ' AS nomeUsuario, 0 AS quantidadeProduto, B.nome FROM produtosrestaurantes A, produtos B WHERE A.produtoId = B.id AND A.restauranteId = ${req.body.codigoRestaurante} AND B.ativo = 1 ORDER BY B.nome`,
    { raw: true }
  );

  if (buscaPedidoResponse.length > 0) {
    for (const itemRestaurante of response[0]) {
      for (const itemPedido of buscaPedidoResponse) {
        if (itemRestaurante.produtoId === itemPedido.produtoId) {
          itemRestaurante.valorProduto = itemPedido.valorProduto
            .toFixed(2)
            .toString();
          itemRestaurante.dataPedido = itemPedido.dataPedido;
          itemRestaurante.nomeUsuario = itemPedido.nomeUsuario;
          itemRestaurante.quantidadeProduto = itemPedido.quantidadeProduto;
        }
      }
      listaFinalResponse.push(itemRestaurante);
    }
  } else {
    for (const itemRestaurante of response[0]) {
      listaFinalResponse.push(itemRestaurante);
    }
  }
  // } else {
  //   const response = await sequelize.query(
  //     `SELECT A.restauranteId, A.produtoId, FORMAT(A.valorProduto,2) AS valorProduto, A.dataPedido, A.usuarioId, A.nomeUsuario, A.quantidadeProduto, B.nome FROM pedidos A, produtos B WHERE A.produtoId = B.id AND A.restauranteId = ${req.body.codigoRestaurante} AND A.dataPedido = '${req.body.dataPedido}'`,
  //     { raw: true }
  //   );

  //   for (const itemRestaurante of response[0]) {
  //     listaFinalResponse.push(itemRestaurante);
  //   }
  // }
  res.send(JSON.stringify(listaFinalResponse));
});

//Salva pedido
app.post("/salvarPedido", async (req, res) => {
  if (req.body.pedido.length > 0) {
    await pedidos
      .destroy({
        where: {
          dataPedido: req.body.pedido[0].dataPedido,
          restauranteId: req.body.pedido[0].restauranteId,
        },
      })
      .catch((err) => {
        console.log(err);
      });

    let quantidadeInclusoes = 0;
    for (const produto of req.body.pedido) {
      if (produto.quantidadeProduto > 0) {
        const incluirResponse = await pedidos
          .create({
            dataPedido: produto.dataPedido,
            restauranteId: produto.restauranteId,
            usuarioId: produto.usuarioId,
            nomeUsuario: produto.nomeUsuario,
            produtoId: produto.produtoId,
            quantidadeProduto: produto.quantidadeProduto,
            valorProduto: produto.valorProduto,
            createdAt: Date(),
            updatedAt: Date(),
          })
          .catch((err) => {
            console.log(err);
          });
        if (incluirResponse) {
          quantidadeInclusoes++;
        }
      }
    }
    if (quantidadeInclusoes > 0) {
      res.send(true);
    }
  }
});

//Busca dados de restaurante
app.post("/buscaDadosRestaurante", async (req, res) => {
  let response = await restaurantes
    .findOne({ where: { id: req.body.restauranteId } })
    .catch((err) => {
      console.log(err);
    });
  res.send(JSON.stringify(response));
});

//Gera relatorio de restaurante em determinado periodo
app.post("/geraRelatorio", async (req, res) => {
  const response = await sequelize.query(
    `SELECT A.produtoId, A.restauranteId, B.nome, SUM(A.quantidadeProduto) AS quantidadeProduto, A.valorProduto, SUM(A.quantidadeProduto * A.valorProduto) AS valorTotalProduto FROM pedidos A, produtos B WHERE A.dataPedido between '${req.body.dataInicio}' AND '${req.body.dataFim}' AND A.restauranteId = ${req.body.restauranteId} AND A.produtoId = B.id GROUP BY A.produtoId`,
    { raw: true }
  );

  let relatorioResponse = [];
  for (const itemRestaurante of response[0]) {
    relatorioResponse.push(itemRestaurante);
  }
  res.send(JSON.stringify(relatorioResponse));
});

//Gera recibos de todos os restaurantes com pedido em uma data
app.post("/geraRecibosPedidosData", async (req, res) => {
  const response = await sequelize.query(
    `SELECT C.nome AS nomeRestaurante, B.nome AS nomeProduto, A.quantidadeProduto, A.valorProduto FROM pedidos A, produtos B, restaurantes C WHERE A.produtoId = B.id AND A.restauranteId = C.id AND A.dataPedido = '${req.body.dataPedido}' ORDER BY C.nome, B.nome`,
    { raw: true }
  );
  let pedidos = [];
  if (response.length > 0) {
    for (const pedido of response[0]) {
      pedidos.push(pedido);
    }
    res.send(JSON.stringify(pedidos));
  }
});

//Busca tokens de usuarios do tipo 1 e 2
app.post("/buscaTokensResponsaveis", async (req, res) => {
  const response = await sequelize.query(
    `SELECT B.token, A.tiposUsuariosId FROM usuarios A, tokens B WHERE (A.tiposUsuariosId = 1 OR A.tiposUsuariosId = 2) AND B.usuarioId = A.id`,
    { raw: true }
  );
  let tokens = [];
  if (response.length > 0) {
    for (const token of response[0]) {
      tokens.push(token);
    }
    res.send(JSON.stringify(tokens));
  }
});

//Grava token na DB
app.post("/token", async (req, res) => {
  let response = await tokens
    .findOne({ where: { token: req.body.token } })
    .catch((err) => {
      console.log(err);
    });
  if (response == null) {
    tokens
      .create({
        token: req.body.token,
        usuarioId: req.body.usuarioId,
        createdAt: Date(),
        updatedAt: Date(),
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

//Envio das notificações
app.post("/notifications", async (req, res) => {
  //Create the messages that you want to send to clients
  let messages = [];
  let somePushTokens = [];

  if (req.body.recipient == "") {
    let response = await tokens.findAll({
      raw: true,
    });
    response.map((elem, ind, obj) => {
      somePushTokens.push(elem.token);
    });
  } else {
    somePushTokens.push(req.body.recipient);
  }

  for (let pushToken of somePushTokens) {
    // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }

    // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
    messages.push({
      to: pushToken,
      sound: "default",
      title: req.body.title,
      body: req.body.message,
      data: { withSome: "data" },
    });
  }

  // The Expo push notification service accepts batches of notifications so
  // that you don't need to send 1000 requests to send 1000 notifications. We
  // recommend you batch your notifications to reduce the number of requests
  // and to compress them (notifications with similar content will get
  // compressed).
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  (async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
      } catch (error) {
        console.error(error);
      }
    }
  })();

  // Later, after the Expo push notification service has delivered the
  // notifications to Apple or Google (usually quickly, but allow the the service
  // up to 30 minutes when under load), a "receipt" for each notification is
  // created. The receipts will be available for at least a day; stale receipts
  // are deleted.
  //
  // The ID of each receipt is sent back in the response "ticket" for each
  // notification. In summary, sending a notification produces a ticket, which
  // contains a receipt ID you later use to get the receipt.
  //
  // The receipts may contain error codes to which you must respond. In
  // particular, Apple or Google may block apps that continue to send
  // notifications to devices that have blocked notifications or have uninstalled
  // your app. Expo does not control this policy and sends back the feedback from
  // Apple and Google so you can handle it appropriately.
  let receiptIds = [];
  for (let ticket of tickets) {
    // NOTE: Not all tickets have IDs; for example, tickets for notifications
    // that could not be enqueued will have error information and no receipt ID.
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  }

  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  (async () => {
    // Like sending notifications, there are different strategies you could use
    // to retrieve batches of receipts from the Expo service.
    for (let chunk of receiptIdChunks) {
      try {
        let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
        console.log(receipts);

        // The receipts specify whether Apple or Google successfully received the
        // notification and information about an error, if one occurred.
        for (let receiptId in receipts) {
          let { status, message, details } = receipts[receiptId];
          if (status === "ok") {
            continue;
          } else if (status === "error") {
            console.error(
              `There was an error sending a notification: ${message}`
            );
            if (details && details.error) {
              // The error codes are listed in the Expo documentation:
              // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
              // You must handle the errors appropriately.
              console.error(`The error code is ${details.error}`);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  })();
});

let port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
  console.log("Servidor Rodando");
});
