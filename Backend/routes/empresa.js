'use strict';

const express  = require('express');
const router  = express.Router();
const EmpresaController = require('../controllers/empresa');
const {verifyToken} = require('../libs/common');

//ROTAS EMPRESA
//POST 
router.post('/',verifyToken,   async (req, res) => {
  const response = await EmpresaController.createEmpresa(req.body);

  return res.status(response.status).send(response)
});

//Listando todas as  empresas
router.get('/',verifyToken,  async (req, res) => {
    const response = await EmpresaController.fetchAllEmpresas(req.body)
    return res.status(response.status).send(response)
  });

//Lista Empresa por id
router.get('/erp',verifyToken,  async (req, res) => {
  
  const response = await EmpresaController.fetchEmpresaERP(req.body)
  return res.status(response.status).send(response)
});

//Lista Empresa por id
router.get('/:id',verifyToken,  async (req, res) => {
  req.body.id = Number(req.params.id);
  const response = await EmpresaController.fetchEmpresa(req.body)
  return res.status(response.status).send(response)
});

router.put('/:id', verifyToken, async (req, res) => {
  req.body.id = Number(req.params.id)
  const response = await EmpresaController.updateEmpresa(req.body)
  return res.status(response.status).send(response)
})



module.exports = router;