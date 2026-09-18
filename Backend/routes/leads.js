"use strict";

const express = require("express");
const router = express.Router();
const leadsController = require("../controllers/leads");
const { verifyToken, verifyERPToken } = require("../libs/common");

// Rota POST para criar lead/cliente
router.post("/", verifyToken, verifyERPToken, async (req, res) => {
  console.log("aces");
  if (req.query.email) {
    req.body.email = req.query.email;
  }
  const response = await leadsController.createLead(req.body);
  return res.status(response.status).send(response);
});

// Rota GET para listar todos os leads/clientes
router.get("/", verifyToken, verifyERPToken, async (req, res) => {
  console.log("acessou o router");
  var controllerData = {};
  console.log(req.query);
  // Processa os parâmetros da query
  if (!req.query.loadfirst) {
    const processedQuery = { ...req.query };

    // Processa especificamente o TAG_LIST
    if (req.query.TAG_LIST) {
      if (Array.isArray(req.query.TAG_LIST)) {
        processedQuery.TAG_LIST = req.query.TAG_LIST;
      } else {
        // Remove espaços e faz split
        processedQuery.TAG_LIST =
          typeof req.query.TAG_LIST === "string"
            ? req.query.TAG_LIST.split(",").map((tag) => tag.trim())
            : [String(req.query.TAG_LIST)];
      }
    }

    // Combina com o body se necessário
    controllerData = {
      ...req.body,
      ...[processedQuery],
    };
  } else {
    controllerData = {
      ...req.body,
    };
  }
  // Se email veio na query, sobrescreve no body
  if (req.query.email) {
    controllerData.email = req.query.email;
  }
  console.log(controllerData);
  const response = await leadsController.fetchAllLeads(controllerData);
  return res.status(response.status).send(response);
});

// Rota GET para buscar lead/cliente por ID
router.get("/:id", verifyToken, async (req, res) => {
  const id = Number(req.params.id);
  const response = await leadsController.getLeadById(id);
  return res.status(response.status).send(response);
});

// Rota PUT para editar lead/cliente por ID
router.put("/:id", verifyToken, async (req, res) => {
  const id = Number(req.params.id);
  const response = await leadsController.updateLead(id, req.body);
  return res.status(response.status).send(response);
});

// Rota DELETE para remover lead/cliente por ID
router.delete("/:id", verifyToken, async (req, res) => {
  const id = Number(req.params.id);
  const response = await leadsController.deleteLead(id);
  return res.status(response.status).send(response);
});

// Rota POST para converter lead em cliente
router.post("/:id/convert", verifyToken, async (req, res) => {
  const id = Number(req.params.id);
  const response = await leadsController.convertLeadToClient(id);
  return res.status(response.status).send(response);
});

// Rota GET para buscar leads por filtros
router.get("/search/filter", verifyToken, async (req, res) => {
  if (req.query.email) {
    req.body.email = req.query.email;
  }
  const response = await leadsController.searchLeads(req.query);
  return res.status(response.status).send(response);
});

module.exports = router;
