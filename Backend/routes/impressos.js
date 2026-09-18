'use strict'

const express = require('express')
const router = express.Router()
const impressosController = require('../controllers/impressos')
const { verifyToken, verifyERPToken } = require('../libs/common')
const fs = require('fs')
var path = require('path')
const { stringify } = require('querystring')

//ROTAS pedidos
router.get('/romaneio/:id', verifyToken, verifyERPToken,async (req, res) => {
  try {
    if (req.query.email) {
      req.body.email = req.query.email
    }
    req.body.romaneio = Number(req.params.id)
    const response = await impressosController.printRomaneio(req.body)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'inline; filename=pedido.pdf')
    //file.pipe(response.data)
    
    //console.log(response)
    return res.status(response.status).send(response?.data?.data);
  
  } catch {}
})

router.get('/pedidos/:id/',verifyERPToken, async (req, res) => {
  try {
    if (req.query.email) {
      req.body.email = req.query.email
    }
    req.body.numero_pedido = Number(req.params.id)
    if (req.query.sendto) {
      req.body.sendto = req.query.sendto
    }
    if (req.query.empresa) {
      req.body.empresa = req.query.empresa
    }
    const response = await impressosController.printPedido(req.body)
    
    if (!req.query.sendto) {
    //  console.log(response.data.data);
      //se nao for para enviar email
    
      res.setHeader('Content-Type', 'application/pdf')
      //file.pipe(response.data)
      
      //console.log(response)
      return res.status(response.status).send(response.data.data)    } else {
      return res.status(response.status).send(response.data)
    }
  } catch(err) {
console.log(err);

  }
})

router.post('/pedidos/:id/',verifyToken, verifyERPToken, async (req, res) => {
  try {
    if (req.query.email) {
      req.body.email = req.query.email
    }
    req.body.numero_pedido = Number(req.params.id)
    if (req.query.sendto) {
      req.body.sendto = req.query.sendto
    }
    if (req.query.empresa) {
      req.body.empresa = req.query.empresa
    }
    const response = await impressosController.printPedido(req.body)

    if (!req.query.sendto) {
      //se nao for para enviar email
      console.log(response)
      //var file = fs.createReadStream(response)
      //res.setHeader('Content-Type', 'application/pdf')
      //res.setHeader('Content-Disposition', 'inline; filename=pedido.pdf')
      //file.pipe(res)
      console.log('8')
      return res.status(response.status).send(response)
    } else {
      return res.status(response.status).send(response)
    }
  } catch {}
})

router.get('/espec', verifyToken,verifyERPToken, async (req, res) => {
  try {
    console.log('entrou')
    const token = req.body.token_erp; // Substitua pelo token real

    if (req.query.email) {
      req.body.email = req.query.email
    }
    req.body.codigo = String(req.query.id)
    if (req.query.sendto) {
      req.body.sendto = req.query.sendto
    }

    const response = await impressosController.printEspec(req.body,token)
  
  console.log('___________________________________')
    console.log(response.data.data)

if(response.data){
   
  return res.status(response.status).send(response.data.data)
    }
    else{
      return res.status(520).send('no files found')

    }
    //res.send(data);
    /*
          var file = fs.createReadStream(response.data);
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'inline; filename=espec.pdf');
          file.pipe(res);*/
  } catch {}
})

module.exports = router
