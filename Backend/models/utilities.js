const db = require("../models/db");
const moment = require("moment");
const { compareSync } = require("bcryptjs");
const axios = require("axios");
const { API, ERP_CONF } = require("../configuration/api");

exports.obtemFiltros = async (id) => {
  const query = db.read
    .select({
      referencia: "referencia",
      campo: "filtro",
      status: "status",
    })
    .from("FILTROS")
    .where("usuario", "=", id);
  return query;
};

exports.salvaFiltro = async (dados) => {
  try {
    const query = await db.write.transaction(async (trx) => {
      // Remova os filtros existentes para o usuário e relatório
      await trx("FILTROS")
        .where({
          referencia: dados.referencia,
          usuario: dados.usuario,
        })
        .del();

      // Insira os novos filtros
      const novosFiltros = dados.campos.map((filtro) => ({
        referencia: dados.referencia,
        filtro: filtro.campo,
        status: filtro.status,
        usuario: dados.usuario,
      }));

      await trx("FILTROS").insert(novosFiltros);
    });

    console.log("Filtros salvos com sucesso!");
    return query;
  } catch (error) {
    console.error("Erro ao salvar filtros:", error.message);
    throw error;
    return error;
  }
};

exports.getClassesReport = async () => {
  try {
    const myPromise = new Promise((resolve, reject) => {
      db.bancoexterno.get(function (err, db) {
        db &&
          db.query(
            `select
      -1 as classe_id,
      '00 - Todas' as classe
    from
      ancora a
    union all
    select
      a.numcds1 as classe_id,
      a.codigo || ' - ' || a.descricao
    from
      cds1 a
    where
      a.numcds1 > 0
    order by
      2 `,
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
                }, 100);
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
  } catch (error) {
    return "";
  }
};

exports.getCarteiraERP = async () => {
  try {
    const myPromise = new Promise((resolve, reject) => {
      db.bancoexterno.get(function (err, db) {
        db &&
          db.query(
            `select
                                NUMCRT1,
                                nome
                          from
                                crt1
                          where
                                ativa = 'S' `,
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
                }, 100);
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
  } catch (error) {
    return "";
  }
};

exports.getPrazoPagamentoMedio = async (reqdata) => {
  try {
    const myPromise = new Promise((resolve, reject) => {
      console.log("acessou prazo pagamento ");

      db.bancoexterno.get(function (err, db) {
        db &&
          db.query(
            `select
                       coalesce(sum(prazo) / count(1), 0) as prazo_medio
                     from
                       sp_prazos('${reqdata.consulta}')`,
            function (err, result) {
              try {
                if (err) {
                  return err;
                }
                if (result != undefined) {
                  console.log(result);
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
  } catch (error) {
    return "";
  }
};

exports.getPrazoPagamentoMedio = async (reqdata) => {
  try {
    const myPromise = new Promise((resolve, reject) => {
      db.bancoexterno.get(function (err, db) {
        db &&
          db.query(
            `select
                         count(1) as qtd_parcelas,
                         coalesce(sum(prazo) / count(1), 0) as prazo_medio
                       from
                         sp_prazos('${reqdata.consulta}')`,
            function (err, result) {
              try {
                if (err) {
                  return err;
                }
                if (result != undefined) {
                  console.log(result);
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
  } catch (error) {
    return "";
  }
};

exports.getEstadosERP = async (reqdata) => {
  console.log("acessou listagem de cidade");

  try {
    var consulta = "q=name==" + "'" + "*" + reqdata.parametro + "*" + "'";

    const query = await axios
      .get(`${ERP_CONF.state}?order=name&first=0&max=51`, {
        headers: {
          tenant: `${API.tenant}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${reqdata.token_erp}`,
          "Access-Control-Allow-Origin": "http://localhost:3000",
          Origin: "http://localhost:3000",
        },
      })
      .then((result) => {
        console.log(result);
        return result.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    return query;
  } catch (error) {
    console.log(error);
    return "";
  }
};
exports.getClassesERP = async () => {
  try {
    const myPromise = new Promise((resolve, reject) => {
      db.bancoexterno.get(function (err, db) {
        db &&
          db.query(
            `select
                                a.NUMCDS1 as classe_id,
                                a.CODIGO as classe_codigo,
                                a.DESCRICAO as classe_descricao
                              From
                                cds1 a `,
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
                }, 100);
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
  } catch (error) {
    return "";
  }
};

exports.getDepartamentosERP = async () => {
  try {
    const myPromise = new Promise((resolve, reject) => {
      db.bancoexterno.get(function (err, db) {
        db &&
          db.query(
            `select
                                  a.numv2$dpt1 as departamento_id,
                                  a.descricao as departamento
                                from
                                  v2$dpt1 a `,
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
                }, 100);
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
  } catch (error) {
    return "";
  }
};

exports.getMarcasERP = async () => {
  try {
    const myPromise = new Promise((resolve, reject) => {
      db.bancoexterno.get(function (err, db) {
        db &&
          db.query(
            `select
                                  a.id as marca_id,
                                  a.descricao as marca
                                from
                                  v3$itens_marcas a `,
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
                }, 100);
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
  } catch (error) {
    return "";
  }
};

exports.getStatusPedidos = async (reqdata) => {
  try {
    const query = await axios
      .get(`${ERP_CONF.salesStatus}`, {
        headers: {
          tenant: `${API.tenant}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${reqdata.token_erp}`,
          "Access-Control-Allow-Origin": "http://localhost:3000",
          Origin: "http://localhost:3000",
        },
      })
      .then((result) => {
        console.log(result.data);
        return result.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    return query;
  } catch (error) {
    console.log(error);
    return "";
  }
};

exports.getQualidadeProduto = async () => {
  try {
    const myPromise = new Promise((resolve, reject) => {
      db.bancoexterno.get(function (err, db) {
        db &&
          db.query(
            `select
            a.nummv$qld1 as qualidade_id,
            a.codigo || ' - ' || a.descricao as qualidade
          from
            mv$qld1 a
          order by
            a.sequencia`,
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
                }, 100);
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
  } catch (error) {
    return "";
  }
};

exports.getPrazoPagamento = async (reqdata) => {
  try {
    const query = await axios
      .get(`${ERP_CONF.salesParcel}?q=sale.id==${reqdata.pedido_id}`, {
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
        // console.log(result.data);
        return result.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    return query;
  } catch (error) {
    console.log(error);
    return "";
  }
};

exports.getPriceList = async (reqdata) => {
  try {
    consulta = "q=description==" + "'" + "*" + reqdata.parametro + "*" + "'";

    const query = await axios
      .get(`${ERP_CONF.priceList}?${consulta}`, {
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
        return result.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    return query;
  } catch (error) {
    console.log(error);
    return "";
  }
};

exports.getcity = async (reqdata) => {
  try {
    var consulta = "";
    if (reqdata.parametro) {
      consulta = "q=name==" + "'" + "*" + reqdata.parametro + "*" + "'";
    } else if (reqdata.codigo_fiscal) {
      consulta =
        "q=properties.fiscal_br_cMun==" + Number(reqdata.codigo_fiscal);
    }

    const query = await axios
      .get(`${ERP_CONF.city}?${consulta}&first=0&order=id&max=51`, {
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
        console.log(result.data);
        return result.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    return query;
  } catch (error) {
    console.log(error);
    return "";
  }
};
exports.getperfilVendas = async (reqdata) => {
  try {
    const query = await axios
      .get(`${ERP_CONF.perfilVendas}`, {
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
        //  console.log(result);
        return result.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    return query;
  } catch (error) {
    console.log(error);
    return "";
  }
};
exports.getperfilFiscal = async (reqdata) => {
  try {
    const query = await axios
      .get(`${ERP_CONF.perfilFiscal}`, {
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
        return result.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    return query;
  } catch (error) {
    console.log(error);
    return "";
  }
};
exports.getBusinessGroup = async (reqdata) => {
  try {
    var consulta =
      "q=description==" + "'" + "*" + reqdata.parametro + "*" + "'";

    const query = await axios
      .get(`${ERP_CONF.businessGroup}?${consulta}&first=0&order=id&max=51`, {
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
        console.log(result.data);
        return result.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    return query;
  } catch (error) {
    console.log(error);
    return "";
  }
};

exports.getCurrencyById = async (reqdata) => {
  console.log("obtendo moeda");
  try {
    var consulta = "q=id==" + "'" + reqdata.parametro + "'";
    console.log(`${ERP_CONF.currency}?${consulta}`);
    const query = await axios
      .get(`${ERP_CONF.currency}?${consulta}`, {
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
        console.log(result.data);
        return result.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    return query;
  } catch (error) {
    console.log(error);
    return "";
  }
};
exports.getCurrency = async (reqdata) => {
  try {
    //var consulta = 'q=id==' + "'" + '*' + reqdata.parametro + '*' + "'";

    //console.log(`${ERP_CONF.currency}?${consulta}`)

    const query = await axios
      .get(`${ERP_CONF.currency}`, {
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
        console.log(result.data);
        return result.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    return query;
  } catch (error) {
    console.log(error);
    return "";
  }
};
