'use strict'

const express = require('express')
const router = express.Router()
const campaignsController = require('../controllers/campaigns')
const { verifyToken } = require('../libs/common')

// Rota POST para criar campanha
router.post('/', verifyToken, async (req, res) => {
  if (req.query.email) {
    req.body.email = req.query.email
  }
  const response = await campaignsController.createCampaign(req.body)
  return res.status(response.status).send(response)
})

// Rota GET para listar todas as campanhas
router.get('/', verifyToken, async (req, res) => {
  if (req.query.email) {
    req.body.email = req.query.email
  }
  const response = await campaignsController.fetchAllCampaigns(req.body)
  return res.status(response.status).send(response)
})
router.get('/ativas', verifyToken, async (req, res) => {
  if (req.query.email) {
    req.body.email = req.query.email
  }
  const response = await campaignsController.fetchAllCampaignsActive(req.body)
  return res.status(response.status).send(response)
})

// Rota GET para buscar campanha por ID
router.get('/:id', verifyToken, async (req, res) => {
  const id = Number(req.params.id)
  const response = await campaignsController.getCampaignById(id)
  return res.status(response.status).send(response)
})

// Rota PUT para editar campanha por ID
router.put('/:id', verifyToken, async (req, res) => {
  const id = Number(req.params.id)
  console.log('acessou a campanha de alteracao')
  console.log(req.body)
  const response = await campaignsController.updateCampaign(id, req.body)
  return res.status(response.status).send(response)
})

// Rota DELETE para remover campanha por ID
router.delete('/:id', verifyToken, async (req, res) => {
  const id = Number(req.params.id)
  const response = await campaignsController.deleteCampaign(id)
  return res.status(response.status).send(response)
})

module.exports = router