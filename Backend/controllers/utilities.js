const { successResponse, errorResponse } = require("../libs/response");
const savefile = require("../libs/functions");
const utilitiesModel = require("../models/utilities");
const { readdir } = require("fs").promises;
const { API } = require("../configuration/api");
const request = require("request");
const fs = require("fs");
const {
  field,
  fieldImage,
  getFirstFileUrl,
  reads3files,
} = require("../libs/functions");

const logStruct = (func, error) => {
  return { func: func, file: "utilitiesController", error };
};

function separarIdGrade(id) {
  const regex = /^(\d+)[\-.\/](\d+)$/;
  const match = id.match(regex);

  if (match) {
    return {
      id: parseInt(match[1], 10),
      grade: parseInt(match[2], 10),
    };
  }
  return null; // Retorna null se o formato for inválido
}
const salvaFiltro = async (reqData) => {
  try {
    const response = await utilitiesModel.salvaFiltro(reqData);
    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("salvafiltro", error));
    return errorResponse(error.status, error.message);
  }
};

const obtemFiltros = async (id) => {
  try {
    const response = await utilitiesModel.obtemFiltros(id);
    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("obtemfiltro", error));
    return errorResponse(error.status, error.message);
  }
};
const getPrazoPagamentoMedio = async (reqData) => {
  try {
    const response = await utilitiesModel.getPrazoPagamentoMedio(reqData);
    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetchprzPagamentoPersonal", error));
    return errorResponse(error.status, error.message);
  }
};

const getCarteiraERP = async (reqData) => {
  try {
    const response = await utilitiesModel.getCarteiraERP();
    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetchCarteiraERPPersonal", error));
    return errorResponse(error.status, error.message);
  }
};
const getClassesERP = async (reqData) => {
  try {
    const response = await utilitiesModel.getClassesERP();
    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetchClassesERPPersonal", error));
    return errorResponse(error.status, error.message);
  }
};
const getEstadosERP = async (reqData) => {
  try {
    const response = await utilitiesModel.getEstadosERP(reqData);
    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetchEstadosERPPersonal", error));
    return errorResponse(error.status, error.message);
  }
};
/*const getImagensFromUrl = async (reqData) => {
  try {
    
    async function getFiles(dir) {
    
      //console.log(`${API.imagens_galeria}/${reqData.mestre_codigo}/${reqData.id}/` + dirent.name);
      const dirents = await readdir(dir, { withFileTypes: true })
      //     //console.log(dirents);
      const files = await Promise.all(
        dirents.map((dirent) => {
          const res = {
            url:
              `${API.imagens_galeria}/${reqData.mestre_codigo}/${reqData.id}/` +
              dirent.name,
          }
          return dirent.isDirectory() ? getFiles(res) : res
        }),
      )
      return Array.prototype.concat(...files)
    }
    if (/[/]+/g.test(reqData.id)) {
      //Tratamento para verificar se o id possui / na string , se sim pegaremos a posição 1 do split
      reqData.id = reqData.id.split('/')[1]
    }
     const response = await getFiles(
      `./imagens/specs/${reqData.mestre_codigo}/${reqData.id}`,
    )
    //console.log(response)
    return successResponse(200, response)
  } catch (error) {
    return errorResponse(error.status, error.message)
  }
}

*/
const getImagensFromUrl = async (reqData) => {
  try {
    const getScript = (url) => {
      return new Promise((resolve, reject) => {
        const http = require("http"),
          https = require("https");

        let client = http;

        if (url.toString().indexOf("https") === 0) {
          client = https;
        }

        client
          .get(url, (resp) => {
            let data = "";
            // coleta item por item
            resp.on("data", (chunk) => {
              data += chunk;
            });
            //  Quando todos os itens forem coletados resolve passando o data.
            resp.on("end", () => {
              resolve(data);
            });
          })
          .on("error", (err) => {
            reject(err);
          });
      });
    };

    if (/[/]+/g.test(reqData.id)) {
      //Tratamento para verificar se o id possui / na string , se sim pegaremos a posição 1 do split
      reqData.id = reqData.id.split("/")[1];
    }
    //console.log(`${API.imagens_galeria}/${reqData.mestre_codigo}/${reqData.id}/`);
    const response = await getScript(
      `${API.imagens_galeria}/${reqData.mestre_codigo}/${reqData.id}/`
    );

    const convertString = response.match(/\.(.*?)\.jp\w*/g);
    //console.log(convertString);

    var response_conv = convertString.map((item) => {
      return {
        url:
          `${API.imagens_galeria}/${reqData.mestre_codigo}/${reqData.id}/` +
          item.split(" ")[1],
        nome: item.split(" ")[1],
      };
    });

    console.log(response_conv[1]);
    //  const response = await utilitiesModel.getEstadosERP();
    return successResponse(200, response_conv);
  } catch (error) {
    console.error("error -> ", logStruct("fetchEstadosERPPersonal", error));
    return errorResponse(error.status, error.message);
  }
};

const getImagensFromExternalUrl = async (reqData) => {
  try {

    let correcao_path = reqData.id || "";

    if (reqData.type === "catalogo") {
      // comportamento original para catálogo
      correcao_path = correcao_path.replace(/[.\-]/g, "/");
      correcao_path = correcao_path.split("/");
    } else {
      if (API.tenant === "lucin") {
        // ajuste exclusivo para lucin
        if (
          reqData.mestre_codigo &&
          reqData.mestre_codigo !== "undefined" &&
          reqData.grade &&
          reqData.grade !== "undefined"
        ) {
          correcao_path = `${reqData.mestre_codigo}/${reqData.grade}`;
        } else {
          // novo tratamento para ids no formato 474847.234.1234
          if (typeof reqData.id === "string" && reqData.id.includes(".")) {
            const [mestreId, ...produtoParts] = reqData.id.split(".");
            const codigoProduto = produtoParts.join(".");

            correcao_path = `${mestreId}/${codigoProduto}`;
          } else {
            const resultado = separarIdGrade(reqData.id);
            correcao_path = `${resultado.id}/${resultado.grade}`;
          }
        }
      } else {



        // comportamento padrão para outros tenants
        if (typeof reqData.id === "string" && reqData.id.includes(".")) {
          const [mestreId, ...produtoParts] = reqData.id.split(".");
          var codigoProduto = produtoParts.join(".");

          if(API.tenant=='emilliaromana'){
            codigoProduto = reqData.grade;
          }


          correcao_path = `${mestreId}/${codigoProduto}`;
        } else {
          correcao_path = reqData.id.replace(/[.\-]/g, "/");
        }
      }
    }
    const files = await reads3files(`imagens/${correcao_path}`);
    let response_conv = files && files[0] ? files : [];

    if (reqData.type === "catalogo") {
      const catalogo = response_conv.find((arquivo) =>
        arquivo.name.endsWith(".pdf")
      );
      response_conv = catalogo || [];
    }

    return successResponse(200, response_conv);
  } catch (error) {
    console.error("error -> ", logStruct("fetchEstadosERPPersonal", error));
    return errorResponse(error.status, error.message);
  }
};
const getDepartamentosERP = async (reqData) => {
  try {
    const response = await utilitiesModel.getDepartamentosERP();
    return successResponse(200, response);
  } catch (error) {
    console.error(
      "error -> ",
      logStruct("fetchDepartamentosERPPersonal", error)
    );
    return errorResponse(error.status, error.message);
  }
};

const getBusinessGroup = async (reqData) => {
  try {
    const response = await utilitiesModel.getBusinessGroup(reqData);
    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetBusinessGroup", error));
    return errorResponse(error.status, error.message);
  }
};

const getMarcasERP = async (reqData) => {
  try {
    const response = await utilitiesModel.getMarcasERP();
    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetchMarcasERPPersonal", error));
    return errorResponse(error.status, error.message);
  }
};

const getStatusPedidos = async (reqData) => {
  try {
    const response = await utilitiesModel.getStatusPedidos(reqData);
    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetchStatusPedidos", error));
    return errorResponse(error.status, error.message);
  }
};

const sendmailPedido = async (reqData) => {
  try {
    const get_pedidopdf = await savefile.gera_pedido_impresso(reqData);

    var pedidos_gerados_enviados = [];

    const get_mail = await savefile.sendmail(
      reqData.emails,
      `Pedido ${reqData.numero_pedido}`,
      reqData.descricao,
      get_pedidopdf,
      reqData.empresa?reqData.empresa:null
    ); //(emails,titulo,descricao,caminho_anexo)

    if (get_mail === "ok") {
      //se enviou o email
      reqData.status_email = "ok";
      pedidos_gerados_enviados.push(reqData);
    } else {
      reqData.status_email = "nok";
      pedidos_gerados_enviados.push(reqData);
    }

    return successResponse(200, {
      sucess: "sucesso",
      data: pedidos_gerados_enviados,
    });
  } catch (error) {
    console.error("error -> ", logStruct("erropedidonaoenviado", error));
    return errorResponse(error.status, error.message);
  }

  //console.log(get_pedidopdf)
};

const getClassesReport = async (reqData) => {
  try {
    const response = await utilitiesModel.getClassesReport();
    return successResponse(200, response);
  } catch (error) {
    console.error(
      "error -> ",
      logStruct("fetchClassesReportERPPersonal", error)
    );
    return errorResponse(error.status, error.message);
  }
};

const getQualidadeProduto = async () => {
  try {
    const response = await utilitiesModel.getQualidadeProduto();
    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetchQualidadeProduto", error));
    return errorResponse(error.status, error.message);
  }
};

const getPrazoPagamento = async (dados) => {
  try {
    const response = await utilitiesModel.getPrazoPagamento(dados);
    console.log("999999999999999999999");
    console.log(response);
    // response.map(item => console.log(item.term));

    const prazo = response
      .map((item) => {
        return item.term;
      })
      .join("/");

    return successResponse(200, prazo);
  } catch (error) {
    console.error("error -> ", logStruct("fetchprzPagamentoPersonal", error));
    return errorResponse(error.status, error.message);
  }
};
const getpriceListERP = async (dados) => {
  try {
    const response = await utilitiesModel.getPriceList(dados);
    // response.map(item => console.log(item.term));

    //  const prazo = response.map(item=> {return  item.term}).join('/');

    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetchPriceList", error));
    return errorResponse(error.status, error.message);
  }
};
const getcityERP = async (dados) => {
  try {
    const response = await utilitiesModel.getcity(dados);
    console.log(response);
    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetchcity", error));
    return errorResponse(error.status, error.message);
  }
};
const getperfilVendas = async (dados) => {
  try {
    const response = await utilitiesModel.getperfilVendas(dados);
    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("perfilVendas", error));
    return errorResponse(error.status, error.message);
  }
};
const getperfilFiscal = async (dados) => {
  try {
    const response = await utilitiesModel.getperfilFiscal(dados);
    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("perfilFiscal", error));
    return errorResponse(error.status, error.message);
  }
};

const getCurrency = async (reqData) => {
  try {
    const response = await utilitiesModel.getCurrency(reqData);
    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("getcurrency", error));
    return errorResponse(error.status, error.message);
  }
};

const getCurrencyById = async (reqData) => {
  try {
    const response = await utilitiesModel.getCurrencyById(reqData);
    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("getcurrency", error));
    return errorResponse(error.status, error.message);
  }
};
module.exports = {
  obtemFiltros,
  salvaFiltro,
  sendmailPedido,
  getCarteiraERP,
  getEstadosERP,
  getClassesERP,
  getDepartamentosERP,
  getMarcasERP,
  getImagensFromUrl,
  getPrazoPagamentoMedio,
  getStatusPedidos,
  getClassesReport,
  getQualidadeProduto,
  getPrazoPagamento,
  getImagensFromExternalUrl,
  getpriceListERP,
  getcityERP,
  getperfilVendas,
  getperfilFiscal,
  getBusinessGroup,
  getCurrency,
  getCurrencyById,
};
