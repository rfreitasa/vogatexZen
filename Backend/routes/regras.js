'use strict'

const express = require('express')
const router = express.Router()
const regrasController = require('../controllers/regras')
const { verifyToken,verifyERPToken} = require('../libs/common')

//Rota POST REGRAS
router.post('/', verifyToken, async (req, res) => {
  if (req.query.email) {
    req.body.email = req.query.email
  }
  const response = await regrasController.criaRegra(req.body)
  return res.status(response.status).send(response)
})

//Lista todas as  regras
//Lista todas as  regras
router.get('/atribuidas/', verifyToken, verifyERPToken, async (req, res) => {
  console.log('obtendo lista atribuida ao usuario')
  if (req.query.email) {
    req.body.email = req.query.email
  }
  if (req.query.usuario) {
    req.body.usuario = req.query.usuario
  }
  const response = await regrasController.fetchAllListAttached(req.body)
  return res.status(response.status).send(response)
})
router.get('/', verifyToken, async (req, res) => {
  if (req.query.email) {
    req.body.email = req.query.email
  }
  const response = await regrasController.fetchAllRegras(req.body)
  return res.status(response.status).send(response)
})

//Lista todas as  regras
router.get('/lista_precos', verifyToken, async (req, res) => {
  if (req.query.email) {
    req.body.email = req.query.email
  }
  const response = await regrasController.fetchAllListaPrecos(req.body)
  return res.status(response.status).send(response)
})

router.get('/lista_precos/:id', verifyToken, async (req, res) => {
  req.body.id = Number(req.params.id)

 
  const response = await regrasController.fetchPriceListByName(req.body)
  return res.status(response.status).send(response)
})
router.post('/lista_precos', verifyToken, async (req, res) => {
  console.log('entrou ')
  console.log(req.body)

  if (req.query.email) {
    req.body.email = req.query.email
  }
  const response = await regrasController.criaListaPrecos(req.body)
  return res.status(response.status).send(response)
})

router.put('/lista_precos/:id', verifyToken, async (req, res) => {
  req.body.id = Number(req.params.id)
  const response = await regrasController.updateListaPrecos(req.body)
  return res.status(response.status).send(response)
})

router.delete('/lista_precos/:id', verifyToken, async (req, res) => {
  req.body.id = Number(req.params.id)
  const response = await regrasController.removeListaPrecos(req.body)
  return res.status(response.status).send(response)
})

//Lista todas as  regras
router.get('/regras_atribuidas', verifyToken, async (req, res) => {
  if (req.query.email) {
    req.body.email = req.query.email
  }
  const response = await regrasController.fetchAllRegrasAtribuidas(req.body)
  console.log(response)
  return res.status(response.status).send(response)
})

router.post('/regras_atribuidas', verifyToken, async (req, res) => {
  if (req.query.email) {
    req.body.email = req.query.email
  }
  const response = await regrasController.criaRegraAtribuida(req.body)
  return res.status(response.status).send(response)
})

router.put('/regras_atribuidas/:id', verifyToken, async (req, res) => {
  req.body.id = Number(req.params.id)
  const response = await regrasController.updateRegrasAtribuidas(req.body)
  return res.status(response.status).send(response)
})
module.exports = router
