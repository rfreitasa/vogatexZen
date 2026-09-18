"use strict";

const express = require("express");
const router = express.Router();
const ProdutosController = require("../controllers/produtos");
const { verifyToken, verifyERPToken } = require("../libs/common");

//ROTAS Produtos

//Listando todos os produtos
router.get('/',verifyToken, verifyERPToken, async (req, res) => {
  if(req.query.codigo){ req.body.codigo= req.query.codigo; }
  if(req.query.nome){req.body.nome=String(req.query.nome); }
  if(req.query.lista_preco){req.body.lista_preco=String(req.query.lista_preco); }
  if(req.query.email){  req.body.email= req.query.email; }
  if(req.query.classeCodigo){req.body.classeCodigo=String(req.query.classeCodigo); }
  if(req.query.grade){req.body.grade=req.query.grade; }
  console.log(req.body)
  
  const response = await ProdutosController.fetchProdutos(req.body)
  return res.status(response.status).send(response)
});

router.get("/consultasaldo", verifyToken, verifyERPToken, async (req, res) => {
  
  if (req.query.email) {
    req.body.email = req.query.email;
  }
  if (req.query.item_id) {
    req.body.item_id = req.query.item_id;
  }
  if (req.query.codigo) {
    req.body.codigo = req.query.codigo;
  }

  if (req.query.empresa_id) {
    req.body.empresa_id = req.query.empresa_id;
  }
  if (req.query.tipo_venda) {
    req.body.tipo_venda = req.query.tipo_venda;
  }
  if (req.query.programacao_data) {
    req.body.programacao_data = req.query.programacao_data;
  }
  const response = await ProdutosController.getSaldoCarrinho(req.body);
  return res.status(response.status).send(response);
});
router.get("/espec/:id", verifyToken, async (req, res) => {
  req.body.id = Number(req.params.id);

  const response = await ProdutosController.getEspecProduto(req.body);
  return res.status(response.status).send(response);
});

router.get("/listadepreco", verifyToken, async (req, res) => {
  if (req.query.email) {
    req.body.email = req.query.email;
  }

  const response = await ProdutosController.getListaPreco(req.body);
  return res.status(response.status).send(response);
});

router.get("/listadepreco/:id", verifyToken, async (req, res) => {
  req.body.id = Number(req.params.id);

  const response = await ProdutosController.getsaldoProduto(req.body);
  return res.status(response.status).send(response);
});

router.get("/byNameAndCod", verifyToken,verifyERPToken, async (req, res) => {
  if (req.query.pesquisa) {
    req.body.pesquisa = req.query.pesquisa;
  }
  req.body.tipo = req.query.tipo;

  // console.log(req.body);
  const response = await ProdutosController.getProdByNameandCod(req.body);
  return res.status(response.status).send(response);
});

module.exports = router;
