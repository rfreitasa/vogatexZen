const db = require("../models/db");
const moment = require("moment");
const axios = require("axios");
const { API, ERP_CONF } = require("../configuration/api");
const { sr } = require("date-fns/locale");
const funcoes = require("../libs/functions");

exports.getSpec = async (dados) => {
  const postData = {
    code: "/catalog/product/report/productTechnicalForm",
    parameters: {
      id: [dados.codigo]
    },
    format: "PDF"
  };
  try {
    const query = await axios
      .post(`${ERP_CONF.reportPrint}`, postData, {
        timeout: 20000,
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
        return result;
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
