const db = require("../models/db");
const moment = require("moment");
const axios = require("axios");
const { API, ERP_CONF } = require("../configuration/api");
const funcoes = require("../libs/functions");

exports.getOperatorNotes = async (reqData) => {
  try {
    //Só mostrar as que tiverem tag notify-commercial
    if (reqData.numero_pedido) {
      const query = await axios
        .get(
          `${ERP_CONF.userlog}&q=source==/sale/sale:${reqData.numero_pedido};tags==notify-commercial`,
          {
            headers: {
              "Content-Type": "application/json",
              tenant: `${API.tenant}`,
              Accept: "application/json",
              Authorization: `Bearer ${reqData.token_erp}`,
              "Access-Control-Allow-Origin": "http://localhost:3000",
              Origin: "http://localhost:3000",
            },
          }
        )
        .then((result) => {
          console.log(result);
          return result.data;
        })
        .catch(function (error) {
          console.log(error);
          //          console.log('Erro na obtenção dos dados' + id.USUARIO_CONTA_ID_ERP)
          return error;
        });

      return query;
    } else {
      //pesquisa de pedidos por varios parametros , exceto numero do pedido
      const body = {
        code: "/sale/report/saleCube",
      };
      body.parameters = reqData.where;
      // console.log(body)
      const query = await axios
        .post(`${ERP_CONF.salesdataSource}`, JSON.stringify(body), {
          headers: {
            "Content-Type": "application/json",
            tenant: `${API.tenant}`,
            Accept: "application/json",
            Authorization: `Bearer ${reqData.token_erp}`,
            "Access-Control-Allow-Origin": "http://localhost:3000",
            Origin: "http://localhost:3000",
          },
        })
        .then((result) => {
          // console.log(result)
          return result.data;
        })
        .catch(function (error) {
          console.log(error);
          //          console.log('Erro na obtenção dos dados' + id.USUARIO_CONTA_ID_ERP)
          return error;
        });

      return query;
    }
  } catch (error) {
    return "erro";
  }
};

exports.getcomissionlist = async (id) => {
  try {
    const query = db.read
      .select("LISTA_PRECOS_PERCENTUAL_COMISSAO_DEFAULT")
      .from("LISTA_PRECOS")
      .where("LISTA_PRECOS_ID", "=", id);
    return query;
  } catch (error) {
    return "";
  }
};

//metodos do primeiro banco
exports.geraPedidoNew = async (
  dados,
  comissao,
  perfil_fiscal,
  lista_preco,
  moeda
) => {
  try {
    console.log(perfil_fiscal);
    console.log(dados.perfil_vendas);
    dados.observacoes =
      dados.observacoes.length > 0
        ? dados.observacoes.split("\n").join("\r\n")
        : null;

    dados.emissao = dados.emissao.replace("/", "-").replace("/", "-");

    //console.log(dados);
    if (dados.referencia.length == 0) {
      dados.referencia = null;
    }
    if (dados.tipo_frete == "EMITENTE") {
      dados.tipo_frete = "ISSUER";
    }
    if (
      dados.tipo_frete == "DESTINATARIO" ||
      dados.tipo_frete == "DESTINATÁRIO"
    ) {
      dados.tipo_frete = "RECIPIENT";
    }

    if (dados.tipo_frete_redespacho != "") {
      if (dados.tipo_frete_redespacho == "EMITENTE") {
        dados.tipo_frete = "ISSUER";
      }
      if (
        dados.tipo_frete_redespacho == "DESTINATARIO" ||
        dados.tipo_frete_redespacho == "DESTINATÁRIO"
      ) {
        dados.tipo_frete_redespacho = "RECIPIENT";
      }
    }

    dados.status = "PREPARED";

    const args = {
      sale: {},
      items: [],
    };

    args.sale = {
      date: moment().format(),
      totalValue: dados.vltotal,
      ...(dados.referencia != null
        ? {
            code: dados.referencia,
          }
        : {}),
        availabilityDate:
        dados.items[0].PROGRAMACAO_NUMERO !== "P.E"
          ? moment(dados.items[0].PROGRAMACAO_DATA).format("YYYY-MM-DD")
          : moment().format("YYYY-MM-DD"),
      saleProfile: {
        id: Number(dados.perfil_vendas),
      },
      priceList: {
        id: Number(lista_preco),
      },
      ...(dados.tipo_frete != ''
        ? {
            freightType: String(dados.tipo_frete),
          }
        : {}),
      person: {
        id: Number(dados.cliente_id),
      },
      ...(dados.transportadora != ""
        ? {
            personShipping: {
              id: Number(dados.transportadora),
            },
          }
        : {}),

      ...(dados.cliente_id_entrega != null && dados.cliente_id_entrega != ""
        ? {
            personAddressShipping: {
              id: Number(dados.cliente_id_entrega),
            },
          }
        : {}),

      company: {
        id: Number(dados.empresa_id),
      },
      currency: {
        id: Number(moeda ? moeda : 1001),
      },
      personSalesperson: {
        id: Number(dados.vendedor_id),
      },
      ...(dados.items[0].PROGRAMACAO_NUMERO !== "P.E"
        ? {
            tags: String(dados.numero_pedido).trim(),
            schedule: {
              id: Number(dados.items[0].PROGRAMACAO_NUMERO),
            },
          }
        : {}),

      fiscalProfileOperation: {
        id: Number(perfil_fiscal),
      },
      properties: {
        paymentMethods: String(dados.prazo_pagamento),
        salesChannel: "SALESBREATH",
        comments: dados.observacoes,
        ...(dados.redespacho != ""
          ? {
              freightTypeTransshipment: String(dados.tipo_frete_redespacho),
              personShippingTransshipment: Number(dados.redespacho),
            }
          : {}),
        salesCommission: Number(comissao),
        salesHub: String(dados.user_erp + " - " + dados.email).trim(),
      },
      status: "PREPARED",
      ...(dados.items[0].PROGRAMACAO_NUMERO !== "P.E"
        ? {
            tags: [
              // Tags para pedidos normais
              dados.id_pedido && String(dados.id_pedido).trim(),
              String(dados.numero_pedido).trim(),
              // Tags da campanha (se existir)
              ...(dados.CAMPANHA_NOME_TAG
                ? [String(dados.CAMPANHA_NOME_TAG), "lead"]
                : []),
            ]
              .filter((tag) => tag && tag !== "")
              .join(","),
          }
        : {
            tags: [
              // Tags da campanha (se existir) - para P.E
              ...(dados.CAMPANHA_NOME_TAG
                ? [String(dados.CAMPANHA_NOME_TAG), "lead"]
                : []),
            ]
              .filter((tag) => tag && tag !== "")
              .join(","),
          }),
    };

    let saleItem = {};

    dados.items.map((item) => {
      let saleItem = {};

      saleItem.sale = args.sale;
      saleItem.productPacking = {
        id: item.PROGRAMACAO_ITEM_ID,
      };
      if (item.PROGRAMACAO_NUMERO != "P.E") {
        saleItem.schedule = {
          id: item.PROGRAMACAO_NUMERO,
        };
      }
      saleItem.unitValue = Number(item.VALOR_UNITARIO);
      saleItem.quantity = Number(item.QUANTIDADE);
      args.items.push(saleItem);
    });

    data = [];

    const postData = JSON.stringify(args);

    console.log(postData);
    const myPromise = new Promise((resolve, reject) => {
      //grava cabeçalho
      axios
        .post(`${ERP_CONF.salesCreate}`, postData, {
          headers: {
            "Content-Type": "application/json",
            tenant: `${API.tenant}`,
            Accept: "application/json",
            Authorization: `Bearer ${dados.token_erp}`,
            "Access-Control-Allow-Origin": "http://localhost:3000",
            Origin: "http://localhost:3000",
          },
        })
        .then((result) => {
          resolve(result);
        })

        .catch(function (error) {
          reject(error.response.data);
        });
    });

    const query = myPromise.then(
      function (value) {
        //Altera o status do pedido
        axios.post(`${ERP_CONF.salesChangeStatus}/${value.data.id}`, "", {
          headers: {
            "Content-Type": "application/json",
            tenant: `${API.tenant}`,
            Accept: "application/json",
            Authorization: `Bearer ${dados.token_erp}`,
            "Access-Control-Allow-Origin": "http://localhost:3000",
            Origin: "http://localhost:3000",
          },
        });
        return value.data;
      },
      function (erro) {
        console.log(erro);
        //      return erro
      }
    );
    return query;
  } catch (error) {
    console.log(error);
    return "";
  }
};

exports.geraCodVendaFake = async () => {
  return Math.floor(Math.random() * 65536);
};

exports.carrinhoExiste = async (id) => {
  try {
    const query = db.read
      .select("*")
      .from("CARRINHO")
      .where("CARRINHO_ID", "=", id);
    return query;
  } catch (error) {
    return "";
  }
};

exports.SalvaPedidoBD = async (dados, pedido) => {
  try {
    const createdAt = moment()
      .tz("America/Sao_Paulo")
      .format("YYYY-MM-DD HH:mm:ss");
    const query = db.write("PEDIDOS").insert({
      PEDIDOS_ID_ERP: carrinho_id || null,
      PEDIDOS_USUARIO_ID: dados.item_id || null,
      PEDIDOS_CLIENTE_ID: dados.item_nome || null,
      PEDIDOS_CLIENTE_NOME: dados.empresa_id_erp || null,
      PEDIDOS_VENDEDOR_ID: dados.empresa_apelido || null,
      PEDIDOS_PRAZO_PAGAMENTO: dados.data_programacao || null,
      PEDIDOS_FORMA_PAGAMENTO: dados.quantidade || null,
      PEDIDOS_PRIORIDADE: dados.lista_preco_id || null,
      PEDIDOS_EMPRESA_ID: dados.valor_unitario || null,
      PEDIDOS_TIPO_FRETE: dados.valor_unitario_padrao || null,
      PEDIDOS_STATUS: dados.valor_unitario * dados.quantidade || null,
      PEDIDOS_OBSERVACOES: dados.tipo_venda || null,
      PEDIDOS_NOTIFICACAO_ADICIONAL: dados.programacao_numero || null,
      PEDIDOS_DTEMISSAO: dados.programacao_item_id || null,
      PEDIDOS_DTPREVISAO_ENTREGA: dados.programacao_item_id || null,

      created_at: createdAt,
      updated_at: createdAt,
    });
    console.info("query -->", query.toQuery());

    //ATUALIZA O UPDATED_AT DO CARRINHO
    db.write("CARRINHO")
      .update({
        UPDATED_AT: createdAt,
      })
      .where("CARRINHO_ID", "=", carrinho_id);

    return query;
  } catch (error) {
    return "";
  }
};

exports.geraPedido = async (dados, comissao, perfil_fiscal) => {
  try {
    dados.observacoes =
      dados.observacoes.length > 0
        ? dados.observacoes.split("\n").join("\r\n")
        : null;

    dados.emissao = dados.emissao.replace("/", "-").replace("/", "-");

    //console.log(dados);
    if (dados.referencia.length == 0) {
      dados.referencia = null;
    }
    if (dados.tipo_frete == "EMITENTE") {
      dados.tipo_frete = "ISSUER";
    }
    if (dados.tipo_frete == "DESTINATARIO") {
      dados.tipo_frete = "RECIPIENT";
    }

    if(dados.tipo_frete == ""){

      dados.tipo_frete = null;
    }

    //const arrayParcels = dados.prazo_pagamento.split('/')

    dados.status = "PREPARED";

    data = [];



    const DISPONIBILIDADE = dados.items[0].TIPO_VENDA;

    const dataD = DISPONIBILIDADE.match(/\d{2}\/\d{2}\/\d{4}/)?.[0]; //RETIRA QUALQUER STRING VINDA JUNTO , TIPO: ESPERA_PRG 12/01/2026, DEVOLVE SO A DATA
    

    var headerData = {
      date: moment().format(),
      totalValue: dados.vltotal,
      ...(dados.referencia != null
        ? {
            code: dados.referencia,
          }
        : {}),
      availabilityDate:
        dados.items[0].PROGRAMACAO_NUMERO != "P.E" && dados.items[0].PROGRAMACAO_NUMERO != "ESPERA_PE"
          ? moment(dataD, "DD/MM/YYYY").format("YYYY-MM-DD")
          : moment().format("YYYY-MM-DD"),
      saleProfile: {
        id: dados.perfil_vendas,
      },
      priceList: {
        id: Number(dados.items[0].LISTA_PRECO),
      },
      ...(dados.tipo_frete != null
        ? {
            freightType: String(dados.tipo_frete),
          }
        : {}),
      person: {
        id: Number(dados.cliente_id),
      },
      ...(dados.transportadora != ""
        ? {
            personShipping: {
              id: Number(dados.transportadora),
            },
          }
        : {}),
      ...(dados.cliente_id_entrega != null && dados.cliente_id_entrega != ""
        ? {
            personAddressShipping: {
              id: Number(dados.cliente_id_entrega),
            },
          }
        : {}),

      company: {
        id: Number(dados.empresa_id),
      },
      currency: {
        id: 1001,
      },
      personSalesperson: {
        id: Number(dados.vendedor_id),
      },
      ...(dados.items[0].PROGRAMACAO_NUMERO !== "P.E"
        ? {
            tags: String(dados.numero_pedido).trim(),
          }
        : {}),
      fiscalProfileOperation: {
        id: Number(perfil_fiscal),
      },
      properties: {
        paymentMethods: String(dados.prazo_pagamento),
        salesChannel: "SALESBREATH",
        comments: dados.observacoes,
        salesCommission: Number(comissao),
      },
      status: "PREPARED",
    };

    const teste = JSON.stringify(headerData);
    console.log(teste);
    const myPromise = new Promise((resolve, reject) => {
      //grava cabeçalho
      axios
        .post(`${ERP_CONF.sales}`, headerData, {
          headers: {
            "Content-Type": "application/json",
            tenant: `${API.tenant}`,
            Accept: "application/json",
            Authorization: `Bearer ${dados.token_erp}`,
            "Access-Control-Allow-Origin": "http://localhost:3000",
            Origin: "http://localhost:3000",
          },
        })
        .then((result) => {
          //   console.log(result)
          //grava itens do pedido
          dados.items.map((item) => {
            //    console.log(item)
            //{"date":"23-01-2023","code":"teste","availabilityDate":"23-01-2023 10:12:33","saleProfile":{"id":1002},"person":{"id":1004},"personShipping":{"id":0},"company":{"id":1001},"currency":{"id":1001},"properties":{"salesPerson":1152,"salesChannel":"SALESBREATH","comments":""},"status":"PREPARING"}',

            const data = {
              productPacking: {
                id: item.PROGRAMACAO_ITEM_ID,
              },
              unitValue: Number(item.VALOR_UNITARIO),
              quantity: Number(item.QUANTIDADE),
              sale: {
                id: result.data.id,
              },
              ...(item.PROGRAMACAO_NUMERO !== "P.E"
                ? {
                    schedule: {
                      id: Number(item.PROGRAMACAO_NUMERO),
                    },
                  }
                : {}),
              properties: {
                salesCommission: Number(comissao),
              },
            };

            //Adiciona os itens
            axios.post(`${ERP_CONF.salesitem}`, data, {
              headers: {
                "Content-Type": "application/json",
                tenant: `${API.tenant}`,
                Accept: "application/json",
                Authorization: `Bearer ${dados.token_erp}`,
                "Access-Control-Allow-Origin": "http://localhost:3000",
                Origin: "http://localhost:3000",
              },
            });
          });
          /*   //Muda o status do pedido de Praparing para prepared
             axios.post(`${ERP_CONF.salesChangeStatus}/${result.data.id}`, {
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${dados.token_erp}`,
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                Origin: 'http://localhost:3000',
              },
            })
  */
          //var itens = data[0];
          //Object.assign({}, data)
          /*
          arrayParcels.map((item) => {
            var parcels = {
              sale: {
                id: result.data.id,
              },
              type: 'BILLING_TITLE',
              term: item,
            }
            axios.post(`${ERP_CONF.salesParcel}`, parcels, {
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${dados.token_erp}`,
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                Origin: 'http://localhost:3000',
              },
            })

            //resolve(result.data.id)
          })*/

          resolve(result);
        })

        .catch(function (error) {
          // console.log(error)
          reject(error.response.data);
        });
    });

    const query = myPromise.then(
      function (value) {
        return value.data;
        // Success!
      },
      function (erro) {
        console.log(erro);
        //      return erro
      }
    );
    return query;
  } catch (error) {
    console.log(error);
    return "";
  }
};

exports.gravaPedidoSB = async (id_usuario, data) => {
  const createdAt = moment().format("YYYY-MM-DD hh:mm:ss");
  const query = db
    .write("PEDIDOS")
    .insert({
      PEDIDOS_ID_ERP: data.numero_pedido || 0,
      PEDIDOS_USUARIO_ID: id_usuario || 0,
      PEDIDOS_CLIENTE_ID: data.cliente_id || 0,
      PEDIDOS_VENDEDOR_ID: data.vendedor_id || 0,
      PEDIDOS_PRAZO_PAGAMENTO: data.prazo_pagamento || 0,
      PEDIDOS_FORMA_PAGAMENTO: data.forma_pagamento || 0,
      PEDIDOS_EMPRESA_ID: data.empresa_id || 0,
      PEDIDOS_TIPO_FRETE: data.tipo_frete || 0,
      PEDIDOS_STATUS: data.status || 0,
      PEDIDOS_OBSERVACOES: data.observacoes || 0,
      PEDIDOS_NOTIFICACAO_ADICIONAL: data.emails_adicionais || 0,
      PEDIDOS_DTEMISSAO: data.emissao || 0,
      PEDIDOS_DTPREVISAO_ENTREGA: data.dt_previsao_entrega || 0,
      PEDIDOS_TRANSPORTADORA: data.transportadora || 0,
      PEDIDOS_REDESPACHO: data.redespacho || null,
      CREATED_AT: createdAt,
      UPDATED_AT: createdAt,
    })
    .returning("id")
    .then(([id]) => console.log(id)); //id here;;
  console.info("query -->", query.toQuery());
  return query;
};

exports.gravaPedidoItensSB = async (id_pedido, data) => {
  const createdAt = moment().format("YYYY-MM-DD hh:mm:ss");
  const query = db.write("PEDIDOS_ITENS").insert({
    PEDIDOS_ITENS_ID_PEDIDO: id_pedido || 1,
    PEDIDOS_ITENS_ITEM_ID: data.item_id || 0,
    PEDIDOS_ITENS_ITEM_NOME: data.item_nome || 0,
    PEDIDOS_ITENS_EMPRESA_ID: data.empresa_id || 0,
    PEDIDOS_ITENS_EMPRESA_APELIDO: data.empresa_apelido || 1,
    PEDIDOS_ITENS_DATA_PROGRAMACAO: data.data_programacao || 0,
    PEDIDOS_ITENS_QUANTIDADE: data.quantidade || 0,
    PEDIDOS_ITENS_LISTA_PRECO_ID: data.lista_preco_id || 0,
    PEDIDOS_ITENS_VALOR_UNITARIO: data.valor_unitario || 0,
    PEDIDOS_ITENS_VALOR_UNITARIO_PADRAO: data.valor_unitario_padrao || 0,
    PEDIDOS_ITENS_TIPO_VENDA: data.tipo_venda || 0,
    PEDIDOS_ITENS_PROGRAMACAO_NUMERO: data.programacao_numero || null,
    PEDIDOS_ITENS_PROGRAMACAO_ITEM_ID: data.programacao_item_id || 0,
    CREATED_AT: createdAt,
    UPDATED_AT: createdAt,
  });
  console.info("query -->", query.toQuery());
  return query;
};

exports.getpedidos = async (reqData) => {
  try {
    //  const empresas = await getEmpresasAtivas;
    const empresasAtivas = await funcoes.getEmpresasAtivas();

    reqData.where.COMPANY_IDS = empresasAtivas;
    if (reqData.where.SALE_ID) {
      //Pesquisa de um unico pedido
      const apiSyntaxCompany = `(${empresasAtivas
        .map((id) => `company.id==${id}`)
        .join(",")})`;

      const query = await axios
        .get(
          `${ERP_CONF.sales}?q=id==${reqData.where.SALE_ID};${apiSyntaxCompany}`,
          {
            headers: {
              "Content-Type": "application/json",
              tenant: `${API.tenant}`,
              Accept: "application/json",
              Authorization: `Bearer ${reqData.token_erp}`,
              "Access-Control-Allow-Origin": "http://localhost:3000",
              Origin: "http://localhost:3000",
            },
          }
        )
        .then((result) => {
          return result.data;
        })
        .catch(function (error) {
          console.log(error);
          //          console.log('Erro na obtenção dos dados' + id.USUARIO_CONTA_ID_ERP)
          return error;
        });

      return query;


    } 
    
    else  if (reqData.where.SALE_CODE) {
      //Pesquisa de um unico pedido
      const apiSyntaxCompany = `(${empresasAtivas
        .map((id) => `company.id==${id}`)
        .join(",")})`;



        const saleCode = `'${reqData.where.SALE_CODE}%'`;

        const query = await axios
          .get(
              `${ERP_CONF.sales}?q=code=ilike=${saleCode};${apiSyntaxCompany}`,
  
            {
            headers: {
              "Content-Type": "application/json",
              tenant: `${API.tenant}`,
              Accept: "application/json",
              Authorization: `Bearer ${reqData.token_erp}`,
              "Access-Control-Allow-Origin": "http://localhost:3000",
              Origin: "http://localhost:3000",
            },
          }
        )
        .then((result) => {
          return result.data;
        })
        .catch(function (error) {
          console.log(error);
          //          console.log('Erro na obtenção dos dados' + id.USUARIO_CONTA_ID_ERP)
          return error;
        });

      return query;
    }
    
    
    else {
      //pesquisa de pedidos por varios parametros , exceto numero do pedido
      const body = {
        code: "/sale/report/saleCube",
      };
      body.parameters = reqData.where;

      console.log(body);
      const query = await axios
        .post(`${ERP_CONF.salesdataSource}`, JSON.stringify(body), {
          headers: {
            "Content-Type": "application/json",
            tenant: `${API.tenant}`,
            Accept: "application/json",
            Authorization: `Bearer ${reqData.token_erp}`,
            "Access-Control-Allow-Origin": "http://localhost:3000",
            Origin: "http://localhost:3000",
          },
        })
        .then((result) => {
          return result.data;
        })
        .catch(function (error) {
          console.log(error);
          //          console.log('Erro na obtenção dos dados' + id.USUARIO_CONTA_ID_ERP)
          return error;
        });

      return query;
    }
  } catch (error) {
    return "erro";
  }
};

exports.getComissao = async (cliente_id) => {
  //console.log(cliente_id);

  try {
    const myPromise = new Promise((resolve, reject) => {
      db.bancoexterno.get(function (err, db) {
        db &&
          db.query(
            `select
                                  coalesce(nullif(a.comissao, 0), b.rep_comissao, 0) as comissao
                               from
                                  cad1 a
                                  left join cad1 b on b.numcad1 = a.numcad1rep
                               where
                                  a.numcad1 = ${cliente_id}`,
            function (err, result) {
              try {
                if (err) {
                  console.log(err);
                  return err;
                }
                if (result != undefined) {
                  resolve(result);
                } else {
                  console.log(err);
                  reject(err);
                }
                setTimeout(function () {
                  reject(err);
                }, 1000);
                db.detach();
              } catch (err) {
                console.log(err);
                reject(err);
                db.detach();
              }
            }
          );
        // return query;
      });
      db.bancoexterno.destroy();
    });

    const query = myPromise
      .then((resultado) => {
        return resultado;
      })
      .catch((err) => {
        return err;
      });
    return query;
  } catch (error) {
    return "";
  }
};

exports.getpedidosSql = async (reqData) => {
  var where = "";
  //numero do pedido
  if (reqData.numero_pedido) {
    where =
      where +
      `and (a.numero_sistema = ${reqData.numero_pedido})`; /* filtro por número do pedido */
  }

  if (reqData.referencia) {
    where =
      where +
      ` and (a.referencia = ${reqData.referencia})`; /* filtro por referência do pedido - adicionar*/
  }

  if (reqData.tipo) {
    if (reqData.tipo === "emissao") {
      where =
        where +
        `and (a.emissao between '${reqData.dt_inicial}' and '${reqData.dt_final}')`; /* filtro por período de emissão do pedido */
    } else {
      where =
        where +
        `and (a.previsao between '${reqData.dt_inicial}' and '${reqData.dt_final}')`; /* filtro por período de previsao do pedido */
    }
  }

  if (reqData.status) {
    where =
      where +
      `and (a.status_codigo = '${reqData.status}')`; /* filtro por status do pedido */
  }

  if (reqData.cliente) {
    where =
      where +
      ` and (b.numcad1 = ${reqData.cliente})`; /* filtro por cliente do pedido */
  }

  if (reqData.produto) {
    where =
      where +
      `and exists (
        select
          *
        from
          mv$pdv2 w1
          inner join pro1 w2 on w2.numpro1 = w1.numpro1
          inner join pro1 w3 on w3.numpro1 = coalesce(w2.numpro1origem, w2.numpro1)
        where
          (w1.pedido_venda_id = a.id)
          and ( (w2.numpro1 = '${reqData.produto}') or (w3.numpro1 = '${reqData.produto}')) )`;
  }

  if (reqData.vendedor) {
    where =
      where +
      ` and (c.numcad1 = ${reqData.vendedor})`; /* filtro por vendedor do pedido */
  }

  if (reqData.supervisor) {
    where =
      where +
      ` and (d.numcad1 = ${reqData.supervisor})`; /* filtro por supervisor do pedido */
  }

  if (reqData.perfil === "supervisor") {
    where =
      where +
      ` and (d.numcad1 = ${reqData.id_user})`; /* filtro por supervisor do pedido */
  }

  if (reqData.perfil === "vendedor") {
    where =
      where +
      ` and (c.numcad1 = ${reqData.id_user})`; /* filtro por vendedor do pedido */
  }

  console.log(`select
a.id as id,
a.numero_sistema as numero_sistema,
a.status_codigo as status,
e.descricao as status_descricao,
f.apelido,
b.nome as cliente_razao_social,
b.cgc as cliente_cgc,
b.NUMCAD1 as cliente_cod,
b.apelido as cliente_apelido,
c.nome as vendedor_razao_social,
c.apelido as vendedor_apelido,

coalesce(g.apelido, g.nome, '<não informado>') as transportadora_nome,
cast(a.emissao as varchar(50)) as pedido_emissao,
cast(a.previsao as varchar(50)) as pedido_previsao,
a.referencia as pedido_referencia,
a.valor_contabil as pedido_valor,
a.prazo_pagto as pedido_prazo_pagamento,
cast(substring(a.observacao from 1 for 4096) as varchar(4096)) as pedido_observacao,
(
  select first 1
    s1.numero_sistema
  from
    mv$rom1 s1
    inner join mv$rom2 s2 on s2.romaneio_id = s1.id
  where
    (s1.pedido_venda_id = a.id)
) as romaneio_numero,
(
  select first 1
    s3.numero
  from
    mv$rom1 s1
    inner join mv$rom2 s2 on s2.romaneio_id = s1.id
    inner join v3$notas_fiscais s3 on s3.romaneio_id = s1.id
    inner join v3$notas_fiscais_itens s4 on s4.nota_fiscal_id = s3.id
  where
    (s1.pedido_venda_id = a.id)
    and (s3.departamento_id = 1)
  order by
    s3.numero desc
) as nota_fiscal_numero,
(
  select first 1
    s3.data_fiscal
  from
    mv$rom1 s1
    inner join mv$rom2 s2 on s2.romaneio_id = s1.id
    inner join v3$notas_fiscais s3 on s3.romaneio_id = s1.id
    inner join v3$notas_fiscais_itens s4 on s4.nota_fiscal_id = s3.id
  where
    (s1.pedido_venda_id = a.id)
    and (s3.departamento_id = 1)
  order by
    s3.numero desc
) as nota_fiscal_emissao,
(
  select first 1
    sum(s2.nf_faturamento_valor)
  from
    mv$rom1 s1
    inner join v3$notas_fiscais s3 on s3.romaneio_id = s1.id
    left join sp_v3$nf_totais(s3.id) s2 on 1 = 1
  where
    (s1.pedido_venda_id = a.id)
    and (s3.departamento_id = 1)
) as nota_fiscal_valor
from
/* pedido */
mv$pdv1 a
/* cliente */
inner join cad1 b on b.numcad1 = a.numcad1
/* vendedor */
inner join cad1 c on c.numcad1 = coalesce(a.numcad1rep, b.numcad1rep)

/* status */
inner join v3$pedidos_vendas_status e on e.codigo = a.status_codigo
/* empresa */
inner join emp1 f on f.numemp1 = a.numemp1
/* transportadora */
left join cad1 g on g.numcad1 = a.numcad1tra
where
( 1 = 1 )
and (a.status_codigo <> '$agrupado')
${where}`);
  try {
    const myPromise = new Promise((resolve, reject) => {
      db.bancoexterno.get(function (err, db) {
        db &&
          db.query(
            `select
             a.id as id,
             a.numero_sistema as numero_sistema,
             a.status_codigo as status,
             e.descricao as status_descricao,
             f.apelido,
             b.nome as cliente_razao_social,
             b.cgc as cliente_cgc,
             b.NUMCAD1 as cliente_cod,
             b.apelido as cliente_apelido,
             c.nome as vendedor_razao_social,
             c.apelido as vendedor_apelido,
           
             coalesce(g.apelido, g.nome, '<não informado>') as transportadora_nome,
             cast(a.emissao as varchar(50)) as pedido_emissao,
             cast(a.previsao as varchar(50)) as pedido_previsao,
             a.referencia as pedido_referencia,
             a.valor_contabil as pedido_valor,
             a.prazo_pagto as pedido_prazo_pagamento,
             cast(substring(a.observacao from 1 for 4096) as varchar(4096)) as pedido_observacao,
             (
               select first 1
                 s1.numero_sistema
               from
                 mv$rom1 s1
                 inner join mv$rom2 s2 on s2.romaneio_id = s1.id
               where
                 (s1.pedido_venda_id = a.id)
             ) as romaneio_numero,
             (
               select first 1
                 s3.numero
               from
                 mv$rom1 s1
                 inner join mv$rom2 s2 on s2.romaneio_id = s1.id
                 inner join v3$notas_fiscais s3 on s3.romaneio_id = s1.id
                 inner join v3$notas_fiscais_itens s4 on s4.nota_fiscal_id = s3.id
               where
                 (s1.pedido_venda_id = a.id)
                 and (s3.departamento_id = 1)
               order by
                 s3.numero desc
             ) as nota_fiscal_numero,
             (
               select first 1
                 s3.data_fiscal
               from
                 mv$rom1 s1
                 inner join mv$rom2 s2 on s2.romaneio_id = s1.id
                 inner join v3$notas_fiscais s3 on s3.romaneio_id = s1.id
                 inner join v3$notas_fiscais_itens s4 on s4.nota_fiscal_id = s3.id
               where
                 (s1.pedido_venda_id = a.id)
                 and (s3.departamento_id = 1)
               order by
                 s3.numero desc
             ) as nota_fiscal_emissao,
             (
               select first 1
                 sum(s2.nf_faturamento_valor)
               from
                 mv$rom1 s1
                 inner join v3$notas_fiscais s3 on s3.romaneio_id = s1.id
                 left join sp_v3$nf_totais(s3.id) s2 on 1 = 1
               where
                 (s1.pedido_venda_id = a.id)
                 and (s3.departamento_id = 1)
             ) as nota_fiscal_valor
           from
             /* pedido */
             mv$pdv1 a
             /* cliente */
             inner join cad1 b on b.numcad1 = a.numcad1
             /* vendedor */
           inner join cad1 c on c.numcad1 = coalesce(a.numcad1rep, b.numcad1rep)

             /* status */
             inner join v3$pedidos_vendas_status e on e.codigo = a.status_codigo
             /* empresa */
             inner join emp1 f on f.numemp1 = a.numemp1
             /* transportadora */
             left join cad1 g on g.numcad1 = a.numcad1tra
           where
             ( 1 = 1 )
             and (a.status_codigo <> '$agrupado')
             ${where}`,
            function (err, result) {
              try {
                if (err) {
                  console.log(err);
                  return err;
                }
                if (result != undefined) {
                  resolve(result);
                } else {
                  console.log(err);
                  reject(err);
                }
                setTimeout(function () {
                  reject(err);
                }, 1000);
                db.detach();
              } catch (err) {
                console.log(err);
                reject(err);
                db.detach();
              }
            }
          );
        // return query;
      });
      db.bancoexterno.destroy();
    });

    const query = myPromise
      .then((resultado) => {
        return resultado;
      })
      .catch((err) => {
        return err;
      });
    return query;
  } catch (error) {
    return "";
  }
};
exports.getpedido = async (reqdata) => {
  try {
    const where =
      "q=sale.id" + encodeURIComponent("==" + reqdata.numero_pedido);

    //reqData.where = encodeURIComponent(reqData.where);
    //console.log(`${ERP_CONF.salesitem}?q=sale.id==${reqData.numero_pedido})`)
    const query = await axios
      .get(`${ERP_CONF.salesitem}?${where}`, {
        headers: {
          "Content-Type": "application/json",
          tenant: `${API.tenant}`,
          Accept: "application/json",
          Authorization: `Bearer ${reqdata.token_erp}`,
          "Access-Control-Allow-Origin": "http://localhost:3000",
          Origin: "http://localhost:3000",
        },
      })
      .then((result) => {
        // console.log(result)
        return result.data;
      })
      .catch(function (error) {
        console.log(error);
        //          console.log('Erro na obtenção dos dados' + id.USUARIO_CONTA_ID_ERP)
        return error;
      });

    return query;
  } catch (error) {
    return "erro";
  }
};

exports.getDanfe = async (reqdata, danfe_id) => {
  try {
    const where = "q=invoice.id" + encodeURIComponent("==" + danfe_id);
console.log('--------------------------------------')
    //reqData.where = encodeURIComponent(reqData.where);
    //console.log(`${ERP_CONF.salesitem}?q=sale.id==${reqData.numero_pedido})`)
    console.log(`${ERP_CONF.salesDanfe}?${where}`)
    const query = await axios
      .get(`${ERP_CONF.salesDanfe}?${where}`, {
        headers: {
          "Content-Type": "application/json",
          tenant: `${API.tenant}`,
          Accept: "application/json",
          Authorization: `Bearer ${reqdata.token_erp}`,
          "Access-Control-Allow-Origin": "http://localhost:3000",
          Origin: "http://localhost:3000",
        },
      })
      .then((result) => {
        console.log(result)
        return result;
      })
      .catch(function (error) {
        console.log(error);
        //          console.log('Erro na obtenção dos dados' + id.USUARIO_CONTA_ID_ERP)
        return error;
      });

    return query;
  } catch (error) {
    return "erro";
  }
};
/*
exports.getpedido = async (reqdata) => {
  try {
    console.log(reqdata)
    //console.log(`${API.pedidos}?s=numeroSistema==${reqdata.numero_pedido}`)
    const query = await axios
      .get(`${ERP_CONF.salesitem}?s=numeroSistema==${reqdata.numero_pedido}`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${reqData.token_erp}`,
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          Origin: 'http://localhost:3000',
        },
      })
      .then((result) => {
        console.log('resultado')
        return result
      })
      .catch(function (error) { console.log(error)})
    //      console.log(query);

    return query
  } catch (error) {
    return ''
  }
}
*/
exports.getpedidosByVendedor = async (vendedor_id, where) => {
  try {
    where = where.split("&s=").join(";");

    //LISTA TODAS AS CONTAS DE ACORDO COM O COD ERP PASSADO

    const query = axios
      .get(
        `${API.pedidos}?s=vendedor.id==${vendedor_id}${where}`,
        {
          auth: { username: API.conexao.user, password: API.conexao.password },
          timeout: 150000,
        },
        {
          withCredentials: true,
          headers: {
            tenant: `${API.tenant}`,
            "Access-Control-Allow-Origin": "http://localhost:3000",
            Origin: "http://localhost:3000",
          },
        }
      )
      .then((result) => {
        if (result.data.length > 0) {
          return result.data;
        }
      })
      .catch(function (error) {
        console.log("Erro na obtenção dos dados" + id.USUARIO_CONTA_ID_ERP);
        return id;
      });

    return query;
  } catch (error) {
    return "";
  }
};

exports.getProgramacao = async (reqdata) => {
  try {
    const query = await axios
      .get(
        `${API.pedidos}?s=id==${reqdata.codigo}`,
        {
          auth: { username: API.conexao.user, password: API.conexao.password },
          timeout: 150000,
        },
        {
          withCredentials: true,
          headers: {
            tenant: `${API.tenant}`,
            "Access-Control-Allow-Origin": "http://localhost:3000",
            Origin: "http://localhost:3000",
          },
        }
      )
      .then((result) => {
        return result.data;
      })
      .catch(function (error) {});

    return query;
  } catch (error) {
    return "";
  }
};

exports.InsereNumPedidoItemCart = async (num_pedido, dados) => {
  try {
    const query = db
      .write("CARRINHO_ITEM")
      .update({
        PEDIDO_NUM: num_pedido,
      })
      .where("ITEM_ID", "=", dados.ITEM_ID)
      .where("EMPRESA_ID", "=", dados.ITEM_ID)
      .where("TIPO_VENDA", "=", dados.TIPO_VENDA);

    return query;
  } catch (error) {
    return "";
  }
};
