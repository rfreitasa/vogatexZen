'use strict';

const express  = require('express');
const router  = express.Router();
const OrganizacaoController = require('../controllers/organizacao');
const {verifyToken} = require('../libs/common');

//ROTAS ORGANIZACOES
//POST 
router.post('/',verifyToken,  async (req, res) => {
  const response = await OrganizacaoController.createOrganizacao(req.body);

  return res.status(response.status).send(response)
});

router.put('/',verifyToken,  async (req, res) => {
  const response = await OrganizacaoController.updateOrganizacao(req.body);

  return res.status(response.status).send(response)
});
//Lista todas as  organizacoes
router.get('/',verifyToken, async (req, res) => {
    const response = await OrganizacaoController.fetchAllOrganizacoes(req.body)
    return res.status(response.status).send(response)
  });

//Lista organizacao por id
router.get('/:id',verifyToken, async (req, res) => {
  req.body.id = Number(req.params.id);
  const response = await OrganizacaoController.fetchOrganizacao(req.body)
  return res.status(response.status).send(response)
});

module.exports = router;