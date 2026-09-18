"use strict";

const express = require("express");
const router = express.Router();
const RelatoriosController = require("../controllers/relatorios");
const { verifyToken, verifyERPToken } = require("../libs/common");
const fs = require("fs");
const axios = require("axios");
const { API, ERP_CONF } = require("../configuration/api");

//ROTAS relatorios

//Get Reports data.
router.get("/", verifyToken, verifyERPToken, async (req, res) => {
  try {
    var response = "";
    const token = req.body.token_erp; // Substitua pelo token real
    if (req.query.relatorio == "EGR1000") {
      var dados = {
        relatorio: `${ERP_CONF.reportUserlist}`,
        email: req.query.email,
        campos: req.query.camposEscolhidos,
        labels: req.query.labels,
        tamanhos: req.query.tamanhos,
        filtros: req.query.data,
        token,
      };
      response = await RelatoriosController.getReportEGR1000(dados);
    } else if (req.query.relatorio == "PEDIDOSVENDA") {
      const dataObj = JSON.parse(req.query.data);

      dataObj.token = token; // Mapeia as chaves e valores do objeto para o formato campo=valo
      response = await RelatoriosController.getReportPEDIDOSVENDA(
        dataObj,
        req.query.email
      );

      console.log(response.data)
      return res.status(response.status).send(response.data);
    } else if (req.query.relatorio == "NOTASFISCAIS") {
      const dataObj = JSON.parse(req.query.data);

      dataObj.token = token; // Mapeia as chaves e valores do objeto para o formato campo=valo
    /*  const dataString = Object.keys(dataObj)
        .map((key) => {
          const value = dataObj[key];
          // Verifica se o valor não é vazio ("") e não é null
          if (value !== "" && value !== null && key != "supervisorId") {
            return `${key}=${encodeURIComponent(value)}`;
          }
          return null; // Retorna null para indicar que o campo deve ser excluído
        })
        .filter((value) => value !== null) // Filtra os valores nulos (campos excluídos)
        .join("&");
      */
        response = await RelatoriosController.getReportNOTASFISCAIS(
        dataObj,
        req.query.email
      );
      return res.status(response.status).send(response.data);
    } else if (req.query.relatorio == "CONTASARECEBER") {
      const dataObj = JSON.parse(req.query.data);

      dataObj.token = token; // Mapeia as chaves e valores do objeto para o formato campo=valo
      const dataString = Object.keys(dataObj)
        .map((key) => {
          const value = dataObj[key];
          // Verifica se o valor não é vazio ("") e não é null
          if (value !== "" && value !== null && key != "supervisorId") {
            return `${key}=${encodeURIComponent(value)}`;
          }
          return null; // Retorna null para indicar que o campo deve ser excluído
        })
        .filter((value) => value !== null) // Filtra os valores nulos (campos excluídos)
        .join("&");

      response = await RelatoriosController.getReportCONTASARECEBER(
        dataString,
        req.query.email
      );
      return res.status(response.status).send(response.data);
    } else if (req.query.relatorio == "EIR4002") {
      response = await RelatoriosController.getReportEIR4002(req.query);
    } else if (req.query.relatorio == "EIR6000") {
      var dados = "";
      if (req.query.dados == "product_code") {
        dados = {
          relatorio: `${ERP_CONF.reportRankingVendas}`,
          email: req.query.email,
          campos: [
            req.query.dados,
            "product_description",
            "invoiceItem_quantity",
            "invoiceItem_totalValue",
          ],
          labels: [
            req.query.dados == "salesperson_name"
              ? "Vendedor"
              : req.query.dados == "person_nameCalc"
              ? "Nome"
              : req.query.dados == "personGroup_description"
              ? "Grupo empresarial"
              : req.query.dados == "city_name"
              ? "Cidade"
              : req.query.dados == "state_name"
              ? "Estado"
              : req.query.dados == "product_code"
              ? "Produto mestre"
              : req.query.dados,
            "Descrição",
            "Quantidade",
            "Total",
            "%",
          ],
          tipos: ["string", "string", "decimal", "moeda", "percent"],
          tamanhos: ["80", "200", "80", "50", "30"],
          filtros: req.query,
          token,
        };
      } else {
        dados = {
          relatorio: `${ERP_CONF.reportRankingVendas}`,
          email: req.query.email,
          campos: [
            req.query.dados,
            "invoiceItem_quantity",
            "invoiceItem_totalValue",
          ],
          labels: [
            req.query.dados == "salesperson_name"
              ? "Vendedor"
              : req.query.dados == "person_nameCalc"
              ? "Nome"
              : req.query.dados == "personGroup_description"
              ? "Grupo empresarial"
              : req.query.dados == "city_name"
              ? "Cidade"
              : req.query.dados == "state_name"
              ? "Estado"
              : req.query.dados == "productPacking_code"
              ? "Produto filho"
              : req.query.dados == "product_category_description_1"
              ? "Classe"
              : req.query.dados,
            "Quantidade",
            "Total",
            "%",
          ],
          tipos: ["string", "decimal", "moeda", "percent"],
          tamanhos: ["240", "80", "80", "30"],
          filtros: req.query,
          token,
        };
      }
      response = await RelatoriosController.getReportEIR6000(dados);
    } else if (req.query.relatorio == "EIR6000COM") {
      var dados = "";
      if (req.query.dados == "product_code") {
        dados = {
          relatorio: `${ERP_CONF.reportRankingVendas}`,
          email: req.query.email,
          campos: [
            req.query.dados,
            "product_description",
            "sum_totalValue",
            "invoiceItem_totalValue",
            "invoice_number",
            "salesCommission",
            "salesCommissionValue",
          ],
          labels: [
            req.query.dados == "salesperson_name"
              ? "Vendedor"
              : req.query.dados == "person_nameCalc"
              ? "Nome"
              : req.query.dados == "personGroup_description"
              ? "Grupo empresarial"
              : req.query.dados == "city_name"
              ? "Cidade"
              : req.query.dados == "state_name"
              ? "Estado"
              : req.query.dados == "product_code"
              ? "Produto mestre"
              : req.query.dados,
            "Descrição",
            "Vl. produto",
            "Total NF",
            "NF",
            "Comissão",
            "Vl.Com",
            "%",
          ],
          tipos: [
            "string",
            "string",
            "moeda",
            "moeda",
            "string",
            "percent",
            "moeda",
            "moeda",
          ],
          tamanhos: ["70", "160", "60", "60", "40", "40", "60", "20"],
          filtros: req.query,
          token,
        };
      } else {
        dados = {
          relatorio: `${ERP_CONF.reportRankingVendas}`,
          email: req.query.email,
          campos: [
            req.query.dados,
            "sum_totalValue",
            "invoiceItem_totalValue",
            "invoice_number",
            "salesCommission",
            "salesCommissionValue",
          ],
          labels: [
            req.query.dados == "salesperson_name"
              ? "Vendedor"
              : req.query.dados == "person_nameCalc"
              ? "Nome"
              : req.query.dados == "personGroup_description"
              ? "Grupo empresarial"
              : req.query.dados == "city_name"
              ? "Cidade"
              : req.query.dados == "state_name"
              ? "Estado"
              : req.query.dados == "productPacking_code"
              ? "Produto filho"
              : req.query.dados == "product_category_description_1"
              ? "Classe"
              : req.query.dados,
            "Vl. produto",
            "Total NF",
            "NF",
            "Comissão",
            "Vl.Com",
            "%",
          ],
          tipos: [
            "string",
            "moeda",
            "moeda",
            "string",
            "percent",
            "moeda",
            "moeda",
          ],
          tamanhos: ["160", "60", "60", "30", "40", "60", "20"],
          filtros: req.query,
          token,
        };
      }
      response = await RelatoriosController.getReportEIR6000(dados);
    } else if (req.query.relatorio == "ALP0008") {
      const dataObj = JSON.parse(req.query.data);

      dataObj.token = token; // Mapeia as chaves e valores do objeto para o formato campo=valo
      const dataString = Object.keys(dataObj)
        .map((key) => {
          const value = dataObj[key];
          // Verifica se o valor não é vazio ("") e não é null
          if (value !== "" && value !== null && key != "supervisorId") {
            return `${key}=${encodeURIComponent(value)}`;
          }
          return null; // Retorna null para indicar que o campo deve ser excluído
        })
        .filter((value) => value !== null) // Filtra os valores nulos (campos excluídos)
        .join("&");

      response = await RelatoriosController.getReportALP0008(dataString);
      return res.status(response.status).send(response.data);
    } else if (req.query.relatorio == "PRONTAENTREGA") {
      response = await RelatoriosController.getReportProntaEntrega(
        req.query,
        token
      );
    } else if (req.query.relatorio == "FICHATECNICA") {
      response = await RelatoriosController.getReportFICHATECNICA(
        req.query,
        token
      );
    } else if (req.query.relatorio == "PROGRAMACAO") {
      response = await RelatoriosController.getReportProgramacao(
        req.query,
        token
      );
    } else if (req.query.relatorio == "VENDASINTETICO") {
      response = await RelatoriosController.getReportVendaSintetico(req.query);
    } else if (req.query.relatorio == "VENDAANALITICO") {
      response = await RelatoriosController.getReportVendaAnalitico(req.query);
    } else if (req.query.relatorio == "LISTAGEMDECONTAS") {
      response = await RelatoriosController.getListagemContas(req.query);
    } else if (req.query.relatorio == "ESTOQUEIMAGEM") {
      response = await RelatoriosController.getReportEstoqueImagem(
        req.query,
        token
      );
    }
    if (req.query.relatorio == "ESTOQUEIMAGEM") {
      return res.status(response.status).send(response);
    } else {
      var file = fs.createReadStream(response.data);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `'inline; filename=${response.data}'`
      );
      file.pipe(res);

      return res.status(response.status).send(res);
    }
  } catch (error) {}
});

//Rota Relatorio ALP001
router.post("/ALP0001", async (req, res) => {
  const response = await RelatoriosController.geraRelatorioALP0001(req.body);
  return res.status(response.status).send(response);
});

const getReportFICHATECNICA = async (reqData) => {
  try {
    //se receber o id com . troco por /
    var correcao_path = reqData.id.replace(/[.\-]/g, "/");
    correcao_path = correcao_path.split("/"); //retiro oque estiver a frente do /

    const files = await reads3files(`imagens/${correcao_path}`);
    var response_conv = files && files[0] ? files : [];

    if (reqData.type == "catalogo") {
      let catalogo = response_conv.find((arquivo) =>
        arquivo.name.endsWith(".pdf")
      );
      //    console.log(catalogo);
      response_conv = catalogo;
    }

    //console.log(convertString);
    //console.log(convertString);

    // new_response.push(element);

    /*   const getScript = (url) => {
         return new Promise((resolve, reject) => {
           const http = require('http'),
             https = require('https')
   
           let client = http
   
           if (url.toString().indexOf('https') === 0) {
             client = https
           }
   
           client
             .get(url, (resp) => {
               let data = ''
               // coleta item por item
               resp.on('data', (chunk) => {
                 data += chunk
               })
               //  Quando todos os itens forem coletados resolve passando o data.
               resp.on('end', () => {
                 resolve(data)
               })
             })
             .on('error', (err) => {
               reject(err)
             })
         })
       }
   
       if (/[/]+/g.test(reqData.id)) {
         //Tratamento para verificar se o id possui / na string , se sim pegaremos a posição 1 do split
         reqData.id = reqData.id.split('/')[1]
       }
       //console.log(`${API.imagens_galeria}/${reqData.mestre_codigo}/${reqData.id}/`);
       const response = await getScript(
         `${API.imagens_galeria}/${reqData.mestre_codigo}/${reqData.id}/`,
       )
   
       console.log('retonro')
       console.log(response)
   //    const convertString = response.match(/\.(.*?)\.jp\w*)
       //console.log(convertString);
   
   /*
       var download = function (uri, filename, callback) {
         request.head(uri, function (err, res, body) {
           console.log('content-type:', res.headers['content-type'])
           console.log('content-length:', res.headers['content-length'])
   
           request(uri).pipe(fs.createWriteStream(filename)).on('close', callback)
         })
         
       }
   
       var response_conv = convertString.map((item) => {
         return {
           url:
             `${API.imagens_galeria}/${reqData.mestre_codigo}/${reqData.id}/` +
             item.split(' ')[1],
           nome: item.split(' ')[1],
           blob: request(
             `${API.imagens_galeria}/${reqData.mestre_codigo}/${reqData.id}/` +
             item.split(' ')[1],
           )
             .pipe(fs.createWriteStream(item.split(' ')[1]))
             .on('close', callback),
         }
       })
   
       console.log(response_conv[1])
       //  const response = await utilitiesModel.getEstadosERP();
     */
    return successResponse(200, response_conv);
  } catch (error) {
    console.error("error -> ", logStruct("fetchEstadosERPPersonal", error));
    return errorResponse(error.status, error.message);
  }
};

module.exports = router;
