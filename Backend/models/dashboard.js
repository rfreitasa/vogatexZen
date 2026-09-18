const db = require("../models/db");
const { API, ERP_CONF } = require("../configuration/api");
const axios = require("axios");
const fs = require("fs");
const funcoes  = require("../libs/functions");


exports.getSalesTarget = async (reqData) => {
  try {
    const myPromise = new Promise((resolve, reject) => {
    
      db.bancoexterno.get(function (err, db) {
        db
          ? db.query(
              `select first 1
             a.meta_valor
           from
             u3$metas a
           where
             (a.conta_vendedor_id = ${reqData.id_erp})
             and (a.data <= current_date)
           order by
             a.data
               `,
              function (err, result) {
                try {
                  if (err) {
                    console.log(err);
                    return err;
                  }
                  if (result != undefined) {
                    console.log("chegando o valor ");
                    console.log(result);
                    if (result[0] && result[0].META_VALOR) {
                      console.log(result);
                      console.log("sem metas" + result[0].META_VALOR);
                      resolve(result[0].META_VALOR);
                    } else {
                      resolve(0);
                    }
                  } else {
                    console.log(err);
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
            )
          : "";
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
  } catch (err) {
    console.log(err);
    return "";
  }
};

exports.getvlvendasmes = async (dados) => {

  const empresas = await funcoes.getEmpresasAtivas();
  const formattedString = `{${empresas.join(",")}}`;

  const postData = {
    code: `${ERP_CONF.reportRankingVendas}`,
    parameters: {
      MULT: -1,
      SIGN: -1,
      SHOW_YEAR:true,
      SHOW_MONTH:dados.where.SHOW_MONTH
      ? true
      : false,
      SHOW_INVOICE: false,
      SHOW_COMPANY: false,
      SHOW_CITY: false,
      SHOW_STATE: false,
      SHOW_COUNTRY: false,
      SHOW_QUANTITY: false,
      SHOW_PERSON: false,
      SHOW_PRODUCT: false,
      SHOW_PRODUCT_PACKING: false,
      SHOW_FISCAL_PROFILE_OPERATION: false,
      SHOW_PERSON_GROUP: false,
      SHOW_SHIPPING: false,
      SHOW_SALESPERSON: false,
      SHOW_PRODUCT_CATEGORY_1: false,
      SHOW_PRODUCT_CATEGORY_2: false,
      SHOW_PRODUCT_CATEGORY_3: false,
      SHOW_PRODUCT_CATEGORY_4: false,
      SHOW_PRODUCT_CATEGORY_5: false,
      SHOW_SALES_HUB: false,
      SHOW_SALES_CHANNEL: false,
      SHOW_TAXATION_OPERATION: false,
      SHOW_PRODUCT_VARIANT: false,
      SHOW_PRODUCT_PROPERTIES_BR_NCM: false,
      SHOW_PRODUCT_PROPERTIES_BR_CEST: false,
      SHOW_INVOICE_SERIES: false,
      PERSON_IDS: null,
      SALESPERSON_IDS: dados.where.SALESPERSON_IDS
        ? dados.where.SALESPERSON_IDS
        : null,
      CITY_IDS: null,
      STATE_IDS: null,
      COUNTRY_IDS: null,
      PRODUCT_IDS: null,
      PRODUCT_PACKING_IDS: null,
      TAXATION_OPERATION_IDS: null,
      COMPANY_IDS: `${formattedString}`,
      FISCAL_PROFILE_OPERATION_IDS: null,
      INVOICE_SERIES_IDS: null,
      DATE_START: `${dados.where.DATE_START}`,
      DATE_END: `${dados.where.DATE_END}`,
      MAX_RECORDS: null,
      FISCAL_PROFILE_OPERATION_TAGS: ["expense", "revenue"]
    },
  };
 
//console.log(postData)
  try {
    const query = await axios
      .post(`${ERP_CONF.reportData}`, postData, {
        headers: {
          tenant: `${API.tenant}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${dados.token_erp}`,
          "Access-Control-Allow-Origin": "http://localhost:3000",
          Origin: "http://localhost:3000",
        },
      })
      .then((result) => {
      //     console.log(result)
       // const data = JSON.stringify(result.data);
      //  fs.writeFileSync("teste.txt", data);

        return result.data;
      })
      .catch(function (error) {
        console.log(error);
        return error;
      });

    return query;
  } catch (error) {
    console.log(error);
    return "erro";
  }
};

exports.getqtdvendasmes = async (id_cliente, perfil) => {
  var filtro = "";
  if (
    perfil === "gerente" ||
    perfil === "supervisor" ||
    perfil === "assistente"
  ) {
    filtro = `and (c.numcad1 = ${id_cliente})`;
  } else if (perfil === "operador" || perfil === "ti") {
  } else {
    //vendedor
    filtro = `and (b.numcad1 = ${id_cliente})`;
  }

  try {
    const myPromise = new Promise((resolve, reject) => {
      db.bancoexterno.get(function (err, db) {
        db.query(
          `select
                                 count(1) as quantidade_vendas
                            from
                                 mv$pdv1 a
                            left join cad1 b on b.numcad1 = a.numcad1rep
                            left join cad1 c on c.numcad1 = b.u4_conta_id_gerente

                            where
                              (a.emissao >= cast('1.' || extract(month from current_date) || '.' || 
                              extract(year from current_date) as date)) 
                              and (a.status_codigo <> '$agrupado')

                   ${filtro}
                  `,
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
exports.gettotfaturado = async (id_cliente, perfil) => {
  var filtro = "";
  if (
    perfil === "gerente" ||
    perfil === "supervisor" ||
    perfil === "assistente"
  ) {
    filtro = `and (c.numcad1 = ${id_cliente})`;
  } else if (perfil === "operador" || perfil === "ti") {
  } else {
    //vendedor
    filtro = `and (b.numcad1 = ${id_cliente})`;
  }

  try {
    const myPromise = new Promise((resolve, reject) => {
      db.bancoexterno.get(function (err, db) {
        db &&
          db.query(
            `select
                              sum(d.valor_contabil * case when e.tipo = 'S' then 1 else -1 end) as valor_total_faturamento
                        from
                              v3$notas_fiscais a
                              inner join v3$notas_fiscais_itens d on d.nota_fiscal_id = a.id
                              left join cad1 b on b.numcad1 = a.conta_id_vendedor
                              left join cad1 c on c.numcad1 = b.u4_conta_id_gerente
                              inner join opr2 e on e.numopr2 = d.operacao_fiscal_id
                        where
                          (a.emissao >= cast('1.' || extract(month from current_date) || '.' || extract(year from current_date) as date))
                          and (e.faturamento = 'S')
                          and ( (e.tipo = 'S' and e.devolucao = 'N') or (e.tipo = 'E' and e.devolucao = 'S') )

                          ${filtro}`,
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

exports.gettotfaturado_1mes = async (id_cliente, perfil) => {
  var filtro = "";
  if (
    perfil === "gerente" ||
    perfil === "supervisor" ||
    perfil === "assistente"
  ) {
    perfil = "GERENTE"; //verificar depois se há tb o perfil de supervisor criado no ERP
  } else if (perfil === "operador" || perfil === "ti") {
    perfil = "OPERADOR";
    id_cliente = Number(id_cliente);
  } else {
    //vendedor
    perfil = "VENDEDOR";
    id_cliente = Number(id_cliente);
  }

  try {
    const myPromise = new Promise((resolve, reject) => {
      db.bancoexterno.get(function (err, db) {
        db &&
          db.query(
            `
                  select
                  a.caption,
                  a.valor
                from
                  sp_sb_faturamento_mensal('${id_cliente}', '${perfil}') a
                
                 `,
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

exports.gettotfaturado_8s = async (id_cliente, perfil) => {
  if (
    perfil === "gerente" ||
    perfil === "supervisor" ||
    perfil === "assistente"
  ) {
    perfil = "GERENTE"; //verificar depois se há tb o perfil de supervisor criado no ERP
  } else if (perfil === "operador" || perfil === "ti") {
    perfil = "OPERADOR";
    id_cliente = Number(id_cliente);
  } else {
    //vendedor
    perfil = "VENDEDOR";
    id_cliente = Number(id_cliente);
  }

  try {
    const myPromise = new Promise((resolve, reject) => {
      db.bancoexterno.get(function (err, db) {
        db &&
          db.query(
            `select
                  a.caption,
                  a.valor
                from
                  sp_sb_faturamento_semanal('${id_cliente}', '${perfil}') a`,
            function (err, result) {
              try {
                if (err) {
                  console.log(err);
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
// gettotfaturado_12m

exports.gettotfaturado_12m = async (id_cliente, perfil) => {
  if (
    perfil === "gerente" ||
    perfil === "supervisor" ||
    perfil === "assistente"
  ) {
    perfil = "GERENTE"; //verificar depois se há tb o perfil de supervisor criado no ERP
  } else if (perfil === "operador" || perfil === "ti") {
    perfil = "OPERADOR";
    id_cliente = Number(id_cliente);
  } else {
    //vendedor
    perfil = "VENDEDOR";
    id_cliente = Number(id_cliente);
  }

  try {
    const myPromise = new Promise((resolve, reject) => {
      db.bancoexterno.get(function (err, db) {
        db &&
          db.query(
            `select
                            a.caption,
                            a.valor
                          from
                            sp_sb_faturamento_anual('${id_cliente}', '${perfil}') a`,
            function (err, result) {
              try {
                if (err) {
                  console.log(err);
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
