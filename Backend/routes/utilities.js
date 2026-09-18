const express = require("express");
const router = express.Router();
const utilitiesController = require("../controllers/utilities");
const { verifyToken, verifyERPToken } = require("../libs/common");

router.get("/currency", verifyToken, verifyERPToken, async (req, res) => {
  if (req.query.parametro) {
    req.body.parametro = req.query.parametro;
  }

  const response = await utilitiesController.getCurrency(req.body);
  return res.status(response.status).send(response);
});

router.get("/currencyById", verifyToken, verifyERPToken, async (req, res) => {
  if (req.query.parametro) {
    req.body.parametro = req.query.parametro;
  }

  const response = await utilitiesController.getCurrencyById(req.body);
  return res.status(response.status).send(response);
});


router.get('/obtemtoken_erp', verifyToken, verifyERPToken, async (req, res) => {

  const response = req.body.token_erp

  console.log(response);
  return res.status(200).send(response);
});


router.get("/businessgroup", verifyToken, verifyERPToken, async (req, res) => {
  if (req.query.parametro) {
    req.body.parametro = req.query.parametro;
  }

  const response = await utilitiesController.getBusinessGroup(req.body);
  return res.status(response.status).send(response);
});

router.post("/salvafiltro", verifyToken, verifyERPToken, async (req, res) => {
  
  const response = await utilitiesController.salvaFiltro(req.body);

  return res.status(response.status).send(response);
});

router.get('/obtemfiltro/:id', verifyToken, verifyERPToken, async (req, res) => {

  const response = await utilitiesController.obtemFiltros(Number(req.params.id));
  console.log(response);
  return res.status(response.status).send(response);
});


router.get("/reportClasses", verifyToken, async (req, res) => {
  const response = await utilitiesController.getClassesReport(req.body);
  return res.status(response.status).send(response);
});

router.post("/sendmailPedidos", verifyToken, verifyERPToken, async (req, res) => {

  const response = await utilitiesController.sendmailPedido(req.body);

  return res.status(response.status).send(response);
});

router.get("/carteiras", verifyToken, async (req, res) => {
  const response = await utilitiesController.getCarteiraERP(req.body);
  return res.status(response.status).send(response);
});

router.get("/statuspedidos", verifyToken, verifyERPToken, async (req, res) => {
  const response = await utilitiesController.getStatusPedidos(req.body);
  return res.status(response.status).send(response);
});

router.get("/estados", verifyToken, verifyERPToken, async (req, res) => {
  if (req.query.parametro) {
    req.body.parametro = req.query.parametro;
  }
  const response = await utilitiesController.getEstadosERP(req.body);
  return res.status(response.status).send(response);
});

router.get("/classes", verifyToken, async (req, res) => {
  const response = await utilitiesController.getClassesERP(req.body);
  return res.status(response.status).send(response);
});

router.get("/departamentos", verifyToken, async (req, res) => {
  const response = await utilitiesController.getDepartamentosERP(req.body);
  return res.status(response.status).send(response);
});

router.get("/marcas", verifyToken, async (req, res) => {
  const response = await utilitiesController.getMarcasERP(req.body);
  return res.status(response.status).send(response);
});

router.get("/prazomedio", verifyToken, async (req, res) => {
  if (req.query.consulta) {
    req.body.consulta = req.query.consulta;
  }

  const response = await utilitiesController.getPrazoPagamentoMedio(req.body);
  return res.status(response.status).send(response);
});


router.get('/prazopagamento/:id', verifyToken, verifyERPToken, async (req, res) => {
  req.body.pedido_id = Number(req.params.id)
  const response = await utilitiesController.getPrazoPagamento(req.body)
  return res.status(response.status).send(response)
});

router.get("/imagens", verifyToken, async (req, res) => {
  if (req.query.item_id) {
    req.body.id = req.query.item_id;
  }
  if (req.query.mestre_id) {
    req.body.mestre_id = req.query.mestre_id;
  }
  if (req.query.mestre_codigo) {
    req.body.mestre_codigo = req.query.mestre_codigo;
  }
  if (req.query.tipo) {
    req.body.tipo = req.query.tipo;
  }

  const response = await utilitiesController.getImagensFromUrl(req.body);

  return res.status(response.status).send(response);
});


router.get("/externalimagens", verifyToken, async (req, res) => {
  if (req.query.item_id) {
    req.body.id = req.query.item_id;
  }
  if (req.query.mestre_id) {
    req.body.mestre_id = req.query.mestre_id;
  }
  if (req.query.mestre_codigo) {
    req.body.mestre_codigo = req.query.mestre_codigo;
  }
  if (req.query.type) {
    req.body.type = req.query.type;
  }
  if (req.query.grade) {
    req.body.grade = req.query.grade;
  }

  const response = await utilitiesController.getImagensFromExternalUrl(req.body);

  return res.status(response.status).send(response);
});
router.get("/qualidadeProdutos", verifyToken, async (req, res) => {
  console.log('chegou');
  const response = await utilitiesController.getQualidadeProduto();
  return res.status(response.status).send(response);
});

router.get("/priceListERP", verifyToken, verifyERPToken, async (req, res) => {
  console.log('chegou');
  if (req.query.parametro) {
    req.body.parametro = req.query.parametro;
  }

  const response = await utilitiesController.getpriceListERP(req.body);
  return res.status(response.status).send(response);
});
router.get("/city", verifyToken, verifyERPToken, async (req, res) => {
  console.log('list city');
  if (req.query.parametro) {
    req.body.parametro = req.query.parametro;
  }
  if (req.query.codigo_fiscal) {
    req.body.codigo_fiscal = req.query.codigo_fiscal;
  }
  const response = await utilitiesController.getcityERP(req.body);
  return res.status(response.status).send(response);
});

router.get("/perfilvendas", verifyToken, verifyERPToken, async (req, res) => {

  if (req.query.parametro) {
    req.body.parametro = req.query.parametro;
  }

  const response = await utilitiesController.getperfilVendas(req.body);
  return res.status(response.status).send(response);
});

router.get("/perfilfiscal", verifyToken, verifyERPToken, async (req, res) => {

  if (req.query.parametro) {
    req.body.parametro = req.query.parametro;
  }

  const response = await utilitiesController.getperfilFiscal(req.body);
  return res.status(response.status).send(response);
});


module.exports = router;
