const db = require("../models/db");
const moment = require("moment");
const axios = require("axios");
const { API,ERP_CONF } = require("../configuration/api");
const empresaModel = require("../models/empresa");
const funcoes = require("../libs/functions");

//metodos do primeiro banco
// Função para obter empresas ativas

exports.ObtemDataProgramacao = async (schedule, token_erp) => {
  try {
    const query = await axios
      .get(`${ERP_CONF.purchase}${schedule}`, {
        headers: {
          "Content-Type": "application/json",
          tenant: `${API.tenant}`,
          Accept: "application/json",
          Authorization: `Bearer ${token_erp}`,
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
  } catch (error) {
    console.log(error);
    return "";
  }
};

exports.getProdByNameandCod = async (filtro) => {
  try {
    if (filtro.pesquisa) {
      if (filtro.tipo == "mestre") {
        consulta = `q=tags!=inactive;(code=ilike='${filtro.pesquisa}%',(description=ilike='%${filtro.pesquisa}%'),(keywords=ilike='%${filtro.pesquisa}%'))&order=code&first=0&max=51`;
      } else {
        //consulta = `q=tags!=inactive;(code=ilike='${filtro.pesquisa}%',(description=ilike='%${filtro.pesquisa}%'),(keywords=ilike='%${filtro.pesquisa}%'))&order=code&first=0&max=51`
        consulta = `q=tags!=inactive;product.tags!=inactive;(code=ilike='${filtro.pesquisa}%',barcode=ilike='${filtro.pesquisa}%',product.code=ilike='${filtro.pesquisa}',(complement=ilike='%${filtro.pesquisa}%'),(product.description=ilike='%${filtro.pesquisa}%'),(product.complement=ilike='%${filtro.pesquisa}%'),(product.keywords=ilike='%${filtro.pesquisa}%'))&order=product.description,code&first=0`;
      }
    } else {
      return "erro";
    }

    const query = await axios
      .get(
        `${
          filtro.tipo == "mestre"
            ? ERP_CONF.productDetails
            : ERP_CONF.productPackingDetails
        }?${consulta}`,
        {
          headers: {
            tenant: `${API.tenant}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${filtro.token_erp}`,
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
        //          console.log('Erro na obtenção dos dados' + id.USUARIO_CONTA_ID_ERP)
        return error;
      });
    return query;
  } catch (error) {
    console.log(error);
    return "";
  }
};

exports.getListaPreco = async (lista_id, token_erp) => {
  try {
    const query = await axios
      .get(`${ERP_CONF.priceListItem}?q=priceList.id==${lista_id}`, {
        headers: {
          tenant: `${API.tenant}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token_erp}`,
          "Access-Control-Allow-Origin": "http://localhost:3000",
          Origin: "http://localhost:3000",
        },
      })
      .then((result) => {
        return result.data;
      })
      .catch(function (error) {
        return error;
      });

    return query;
  } catch (error) {
    return "";
  }
};

exports.getListaPrecoById = async (usuario, senha, id) => {
  try {
    const query = await axios
      .get(
        `${API.listaprecosvenda}`,
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
      .catch(function (error) {
        return error;
      });

    return query;
  } catch (error) {
    return "";
  }
};
exports.getProdutos = async (reqdata, token) => {
  const empresas = await funcoes.getEmpresasClusterAtivas();
  const formattedString = `{${empresas.join(",")}}`;
console.log(reqdata)
  const postData = {
    code: `/salesbreath/stockAvailabilityCubeNew`,
    parameters: {   
      PRODUCT_IDS: reqdata.ids ? `{${reqdata.ids}}` : null,
      PRODUCT_PACKING_IDS: reqdata.codigo ? `{${reqdata.codigo}}` : null,
      PRODUCT_CALC: reqdata.nome ? `%${reqdata.nome}%` : null,
      STOCK_CLUSTER_IDS: `${formattedString}`,
      PRICE_LIST_ID_RETAIL: reqdata.lista_preco
        ? Number(reqdata.lista_preco)
        : null,
    },
  };
  try {
    const query = await axios
      .post(`${ERP_CONF.reportData}`, postData, {
        headers: {
          "Content-Type": "application/json",
          tenant: `${API.tenant}`,
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Access-Control-Allow-Origin": "http://localhost:3000",
          Origin: "http://localhost:3000",
        },
      })
      .then((result) => {
        result.data.sort(function (a, b) {
          const descricaoA = a.productPacking_code.toUpperCase();
          const descricaoB = b.productPacking_code.toUpperCase();

          if (descricaoA < descricaoB) {
            return -1;
          }
          if (descricaoA > descricaoB) {
            return 1;
          }
          return 0;
        });
        return result.data;
      })
      .catch(function (error) {
        console.log(error);
        return error;
      });

    return query;
  } catch (error) {
    return "erro";
  }
};

exports.getProdutosbkp = async (reqdata, token) => {
  const empresas = await funcoes.getEmpresasClusterAtivas();
  const formattedString = `{${empresas.join(",")}}`;

  const postData = {
    code: `/salesbreath/stockAvailabilityCube`,
    parameters: {
      SHOW_TYPE: true,
      SHOW_SUBTYPE: true,
      SHOW_ENTITY: false,
      SHOW_ENTITY_STATUS: false,
      SHOW_STOCK_CLUSTER: true,
      SHOW_WAREHOUSE: false,
      SHOW_PERSON: false,
      SHOW_PRODUCT_VARIANT: true,
      SHOW_PRODUCT: true,
      SHOW_PRODUCT_PACKING: true,
      SHOW_SCHEDULE: true,
      SHOW_SCHEDULE_AVAILABILITY_DATE: true,
      SCHEDULE_IDS: null,
      PRODUCT_IDS: reqdata.ids ? `{${reqdata.ids}}` : null,
      PRODUCT_PACKING_IDS: reqdata.codigo ? `{${reqdata.codigo}}` : null,
      PRODUCT_VARIANT_IDS: null,
      PRODUCT_CODE: null,
      PRODUCT_DESCRIPTION: null,
      PRODUCT_PACKING_CODE: null,
      PRODUCT_PACKING_COMPLEMENT: null,
      PRODUCT_VARIANT_CODE: null,
      PRODUCT_VARIANT_DESCRIPTION: null,
      PRODUCT_CALC: reqdata.nome ? `%${reqdata.nome}%` : null,
      STOCK_CLUSTER_IDS: `${formattedString}`,
      PRICE_LIST_ID_RETAIL: reqdata.lista_preco
        ? Number(reqdata.lista_preco)
        : null,
    },
  };
  try {
    const query = await axios
      .post(`${ERP_CONF.reportData}`, postData, {
        headers: {
          "Content-Type": "application/json",
          tenant: `${API.tenant}`,
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Access-Control-Allow-Origin": "http://localhost:3000",
          Origin: "http://localhost:3000",
        },
      })
      .then((result) => {
        result.data.sort(function (a, b) {
          const descricaoA = a.productPacking_code.toUpperCase();
          const descricaoB = b.productPacking_code.toUpperCase();

          if (descricaoA < descricaoB) {
            return -1;
          }
          if (descricaoA > descricaoB) {
            return 1;
          }
          return 0;
        });
        return result.data;
      })
      .catch(function (error) {
        console.log(error);
        return error;
      });

    return query;
  } catch (error) {
    return "erro";
  }
};

exports.getProdutos2 = async (reqdata, token_erp) => {
  try {
    // console.log(token_erp)
    //  var consulta,
    //     consulta_nome = ''

    if (reqdata.codigo) {
      consulta = "q=productPacking.id==" + reqdata.codigo;
    } else if (reqdata.nome != "") {
      /*   if (reqdata.nome!='') {
        consulta = 'q=productPacking.product.description==' + "'" + '*' + reqdata.nome + '*' + "'" + ',' + 'productPacking.product.code==' + "'" + '*' + reqdata.nome + '*' + "'" + ',' + 'productPacking.code==' + "'" + '*' + reqdata.nome + '*' + "'" + ',' + 'productPacking.id==' + reqdata.nome
      }
      else {
     */ consulta =
        "q=productPacking.product.description==" +
        "'" +
        "*" +
        reqdata.nome +
        "*" +
        "'" +
        "," +
        "productPacking.product.code==" +
        "'" +
        "*" +
        reqdata.nome +
        "*" +
        "'" +
        "," +
        "productPacking.code==" +
        "'" +
        "*" +
        reqdata.nome +
        "*" +
        "'";
      //  }
      //      consulta = 'q=productPacking.id=='  + reqdata.nome
    } else {
      return "";
      //     consulta = ''; // return 'erro'
    }

    const query = await axios
      .get(`${ERP_CONF.product}?${consulta}`, {
        headers: {
          tenant: `${API.tenant}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token_erp}`,
          "Access-Control-Allow-Origin": "http://localhost:3000",
          Origin: "http://localhost:3000",
        },
      })
      .then((result) => {
        //  console.log(result.data)
        return result.data;
      })
      .catch(function (error) {
        console.log(error);
        //          console.log('Erro na obtenção dos dados' + id.USUARIO_CONTA_ID_ERP)
        return error;
      });
    return query;
  } catch (error) {
    console.log(error);
    return "";
  }
};
exports.getProdutosDetails = async (reqdata, token_erp) => {
  try {
    // console.log(token_erp)
    //  var consulta,
    //     consulta_nome = ''

    if (reqdata.codigo) {
      consulta = "q=id==" + reqdata.codigo;
    } else {
      return "erro";
    }

    const query = await axios
      .get(`${ERP_CONF.productDetails}?${consulta}`, {
        headers: {
          tenant: `${API.tenant}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token_erp}`,
          "Access-Control-Allow-Origin": "http://localhost:3000",
          Origin: "http://localhost:3000",
        },
      })
      .then((result) => {
        return result.data;
      })
      .catch(function (error) {
        //          console.log('Erro na obtenção dos dados' + id.USUARIO_CONTA_ID_ERP)
        return error;
      });
    return query;
  } catch (error) {
    console.log(error);
    return "";
  }
};

exports.getProdutos_byID = async (reqdata) => {
  try {
    if (reqdata) {
      const myPromise = new Promise((resolve, reject) => {
        db.bancoexterno.get(function (err, db) {
          db &&
            db.query(
              `select 0 as quantidade, uuid_to_char(a.programacao_id) as programacao_id, a.empresa_id, a.empresa_apelido,  \
                                                  a.descricao,      a.pe_ou_prog,      a.mestre_id,      a.mestre_codigo,      a.item_id,  \
                                                  a.item_codigo,      a.item_nome, a.item_peso_kg , a.item_cubagem ,    a.item_grade,      a.item_unidade,     0 as item_valor_unitario,\
                                                  a.item_saldo,      a.item_previsao   \
                                           from      sp_ud_consulta_estoque_por_item(${reqdata.item_id}) a  \
                                           order by      a.item_codigo`,
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
    }
    //se não for passado parametro , gerar msg de erro
    if (!reqdata) {
      return "erro";
    }
  } catch (error) {
    return "";
  }
};

exports.getEspecProduto = async (id_produto) => {
  try {
    if (id_produto) {
      const myPromise = new Promise((resolve, reject) => {
        db.bancoexterno.get(function (err, db) {
          db &&
            db.query(
              `select
          a.numpro1 as item_id,
          a.codigo as item_codigo,
          a.nome as item_nome,
          a.composicao as composicao,
          a.u4_largura as largura,
          a.u4_gramatura as gramatura,
          a.u4_rendimento as rendimento,
          (select s1.nome from pai1 s1 where s1.numpai1 = a.u4_pais_origem) as pais_origem,
          (select s1.codigo from v3$ncm s1 where s1.ncm_id = a.ncm_id) as classificacao_fiscal,
          (select s1.imagem from v3$imagens s1 where s1.codigo = 'etiqueta.' || coalesce( (select first 1 skip 0 result_column from sp_delimited_text_to_table(a.imagens, ',')), '000')) as imagem01,
          (select s1.imagem from v3$imagens s1 where s1.codigo = 'etiqueta.' || coalesce( (select first 1 skip 1 result_column from sp_delimited_text_to_table(a.imagens, ',')), '000')) as imagem02,
          (select s1.imagem from v3$imagens s1 where s1.codigo = 'etiqueta.' || coalesce( (select first 1 skip 2 result_column from sp_delimited_text_to_table(a.imagens, ',')), '000')) as imagem03,
          (select s1.imagem from v3$imagens s1 where s1.codigo = 'etiqueta.' || coalesce( (select first 1 skip 3 result_column from sp_delimited_text_to_table(a.imagens, ',')), '000')) as imagem04,
          (select s1.imagem from v3$imagens s1 where s1.codigo = 'etiqueta.' || coalesce( (select first 1 skip 4 result_column from sp_delimited_text_to_table(a.imagens, ',')), '000')) as imagem05,
          (select s1.imagem from v3$imagens s1 where s1.codigo = 'etiqueta.' || coalesce( (select first 1 skip 5 result_column from sp_delimited_text_to_table(a.imagens, ',')), '000')) as imagem06,
          (select s1.imagem from v3$imagens s1 where s1.codigo = 'etiqueta.' || coalesce( (select first 1 skip 6 result_column from sp_delimited_text_to_table(a.imagens, ',')), '000')) as imagem07,
          (select s1.imagem from v3$imagens s1 where s1.codigo = 'etiqueta.' || coalesce( (select first 1 skip 7 result_column from sp_delimited_text_to_table(a.imagens, ',')), '000')) as imagem08,
          (select s1.imagem from v3$imagens s1 where s1.codigo = 'etiqueta.' || coalesce( (select first 1 skip 8 result_column from sp_delimited_text_to_table(a.imagens, ',')), '000')) as imagem09,
          (select s1.imagem from v3$imagens s1 where s1.codigo = 'etiqueta.' || coalesce( (select first 1 skip 9 result_column from sp_delimited_text_to_table(a.imagens, ',')), '000')) as imagem10
        from
          pro1 a
        where
                    (a.numpro1 = ${id_produto})`,
              function (err, result) {
                try {
                  if (err) {
                    console.log(err);
                    return err;
                  }
                  if (result != undefined) {
                    resolve(result);
                    //     console.log(result);
                  } else {
                    reject(err);
                  }
                  setTimeout(function () {
                    reject(err);
                  }, 1000);
                  db.detach();
                } catch (err) {
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
          console.log(err);
          return err;
        });
      return query;
    }
    //se não for passado parametro , gerar msg de erro
    if (!id_produto) {
      return "erro";
    }
  } catch (error) {
    return "";
  }
};

exports.getImageEspecProduto = async (id_produto) => {
  try {
    if (id_produto) {
      const myPromise = new Promise((resolve, reject) => {
        db.bancoexterno.get(function (err, db) {
          db &&
            db.query(
              `select\
                    (select s1.imagem_id from v3$imagens s1 where s1.codigo = 'etiqueta.' || a.result_column),\
                    (select s1.imagem from v3$imagens s1 where s1.codigo = 'etiqueta.' || a.result_column),\
                    (select s1.codigo from v3$imagens s1 where s1.codigo = 'etiqueta.' || a.result_column),\
                    (select s1.MD5 from v3$imagens s1 where s1.codigo = 'etiqueta.' || a.result_column)\
                  from\
                    sp_delimited_text_to_table((select s1.imagens from pro1 s1 where s1.numpro1 = '880'), ',') a`,
              function (err, result) {
                try {
                  if (err) {
                    return err;
                  }
                  if (result != undefined) {
                    resolve(result);
                  } else {
                    reject(err);
                  }
                  setTimeout(function () {
                    reject(err);
                  }, 1000);
                  db.detach();
                } catch (err) {
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
    }
    //se não for passado parametro , gerar msg de erro
    if (!id_produto) {
      return "erro";
    }
  } catch (error) {
    return "";
  }
};

exports.getProgramacao = async (reqdata) => {
  try {
    const query = await axios
      .get(
        `http://romana-web.c.personalsoft.com.br/services/rest/v1/itensProgramacoes?s=id==${reqdata.codigo}`,
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
    console.log("conectando banco externo firebird", bancoexterno);
  } catch (error) {
    return "";
  }
};

exports.getUsersPersonal = async () => {
  try {
    db.bancoexterno.get(function (err, db) {
      try {
        db &&
          db.query(
            "select uuid_to_char(a.programacao_id) as programacao_id, a.empresa_id, a.empresa_apelido, \
                         a.descricao,      a.pe_ou_prog,      a.item_id,      a.item_codigo,      a.item_nome,      a.item_grade,  \
                         a.item_unidade,      a.item_valor_unitario,      a.item_saldo,      a.item_previsao   \
                         from      sp_ud_consulta_estoque(7840) a    \
                         order by      a.item_codigo",
            function (err, result) {
              try {
                if (err) {
                  return "erro";
                }

                if (result != undefined) {
                  //return result;
                } else {
                  return "erro ";
                }
              } catch {
                return "erro ao buscar";
              }
            }
          );
        db.detach();
      } catch {
        console.log("Ocorreu um erro ao gerar o pool conexões");
      }
    });

    db.bancoexterno.destroy();
  } catch (error) {
    return "";
  }
};
