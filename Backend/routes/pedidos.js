"use strict";

const express = require("express");
const router = express.Router();
const moment = require("moment");
const pedidosController = require("../controllers/pedidos");
const { verifyToken, verifyERPToken } = require("../libs/common");

//ROTAS pedidos

//Listando todos os pedidos - Receberá ID cliente e email do usuario que esta efetuando a pesquisa
router.get("/", verifyToken, verifyERPToken, async (req, res) => {
  //console.log('otendo pedidos')

  var where = { SHOW_SALE: true };

  for (const key in req.query) {
    if (
      key !== "email" &&
      key !== "apelido" &&
      key !== "perfil" &&
      key !== "tipo"
    ) {
      if (key === "DATE_START" || key === "DATE_END") {
        where[key] = moment(req.query[key]).format("YYYY-MM-DD");
      }  else if (key === "SALESPERSON_IDS") {
        const salespersonIdsString = req.query[key].match(/\[.*\]/)[0];
        const salespersonIdsArray = JSON.parse(salespersonIdsString);
        where[key] = salespersonIdsArray;
      } else if (
        key === "PERSON_IDS" ||
        key === "PRODUCT_PACKING_IDS" ||
        key === "PRODUCT_IDS" ||
        key === "SALE_IDS"
      ) {
        where[key] = Array.isArray(req.query[key])
          ? req.query[key]
          : [req.query[key]];
      } 
      
      else if (key === "TAG_LIST") {
        where[key] = req.query[key].includes(',') ? req.query[key].split(',') : [req.query[key]];

      }
      else {
        where[key] = req.query[key];
      }
    }
  }
  req.body.where = where;
  req.body.email = req.query.email;
  const response = await pedidosController.fetchPedidos(req.body);
  //console.log(response)
  return res.status(response.status).send(response);
});

//Listando todos os pedidos - Receberá ID cliente e email do usuario que esta efetuando a pesquisa
router.get("/pedidossql/", verifyToken, async (req, res) => {
  req.body = req.query;

  const response = await pedidosController.fetchPedidosSql(req.body);
  return res.status(response.status).send(response);
});

router.get("/status", verifyToken, verifyERPToken, async (req, res) => {
  var where = "";
  for (const key in req.query) {
    if (key !== "email") {
      where = where + "&" + "s=" + key + "=" + req.query[key];
    }
  }

  req.body.email = req.query.email;
  req.body.where = where;

  const response = await pedidosController.getStatusPedidoERP(req.body);
  return res.status(response.status).send(response);
});
router.get(
  "/operatorNotes/:id",
  verifyToken,
  verifyERPToken,
  async (req, res) => {
    req.body.numero_pedido = Number(req.params.id);
    const response = await pedidosController.fetchOperatorNotes(req.body);
    return res.status(response.status).send(response);
  }
);

router.get("/:id/", verifyToken, verifyERPToken, async (req, res) => {
  if (req.query.email) {
    req.body.email = req.query.email;
  }
  req.body.numero_pedido = Number(req.params.id);
  const response = await pedidosController.fetchPedido(req.body);
  return res.status(response.status).send(response);
});

router.get("/vendedor/:id/", verifyToken, async (req, res) => {
  if (req.query.email) {
    req.body.email = req.query.email;
  }

  req.body.vendedor_id = Number(req.params.id);

  var where = "";
  for (const key in req.query) {
    if (key !== "email") {
      where = where + "&" + "s=" + key + "=" + req.query[key];
    }
  }

  req.body.email = req.query.email;
  req.body.where = where;

  const response = await pedidosController.fetchPedidoByVendedor(req.body);
  return res.status(response.status).send(response);
});

//POSTS
router.post("/", verifyToken, verifyERPToken, async (req, res, next) => {
  const response = await pedidosController.gerarPedido(req.body);

  return res.status(response.status).send(response);
});

module.exports = router;
