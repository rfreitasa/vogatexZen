'use strict'

const express = require('express')
const router = express.Router()
const multer = require('multer');
const ClientesController = require('../controllers/clientes')
const { verifyToken, verifyERPToken } = require('../libs/common');
const { API, ERP_CONF } = require('../configuration/api');
const axios = require('axios')
const fs = require('fs');


// Configuração do multer para lidar com uploads de arquivos
const upload = multer();
//ROTAS CLIENTES
//POST
router.post('/', verifyToken, verifyERPToken, async (req, res) => {

  console.log(req.body)
  const response = await ClientesController.createConta(req.body)

  return res.status(response.status).send(response)
})

router.post('/:id/contatos', verifyToken, async (req, res) => {
  req.body.id = Number(req.params.id)
  const response = await ClientesController.createContato(req.body)

  return res.status(response.status).send(response)
})
router.post('/:id/arquivos', verifyToken, verifyERPToken, async (req, res) => {
  try {
    const token_erp = req.body.token_erp; // Substitua pelo token real
    var id = Number(req.params.id);

    upload.single('anexo')(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        console.log('Erro no upload do arquivo:', err);
        return res.status(400).json({ error: 'Erro no upload do arquivo' });
      } else if (err) {
        console.log('Erro:', err);
        return res.status(500).json({ error: 'Ocorreu um erro' });
      }

      const anexo = req.file;
      const descricao = req.body.descricao;
      
      // Convertendo o buffer do arquivo para uma string base64
      const content = anexo.buffer.toString('base64');


      const response = await axios.post(`${ERP_CONF.files}`, {
        source: `/catalog/person/person:${id}`,
        description: descricao,
        content: content,
        contentType: anexo.mimetype,
        accessible: true,
        tags: "salesbreath"
      }, {
        headers: {
          tenant: `${API.tenant}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token_erp}`,
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          Origin: 'http://localhost:3000',
        },
      });

      if (response.data.id > 0) {
        return res.status(200).json({ message: 'Arquivo gravado com sucesso' });
      } else {
        return res.status(400).json({ error: 'Erro no upload do arquivo' });
      }
    });
  } catch (error) {
    console.error('Erro ao enviar arquivo para a API externa:', error);
    res.status(500).json({ error: 'Erro ao enviar arquivo para a API externa' });
  }
});

router.put('/:id/contatos', verifyToken, async (req, res) => {
  req.body.id = Number(req.params.id)
  const response = await ClientesController.updateContato(req.body)

  return res.status(response.status).send(response)
})

//Listando todos os clientes
router.get('/', verifyToken, verifyERPToken, async (req, res) => {
  if (req.query.email) {
    req.body.email = req.query.email
  } else if (req.query.nome) {
    req.body.nome = req.query.nome
  }
console.log(req.query)
  var where = 'q='
  var controle = 0
  for (const key in req.query) {
    if (key !== 'email' && key !== 'fantasyName' && key !== 'apelido' && key !== 'concat_cliente') {
      if (controle == 0) {
        where = where + key + encodeURIComponent('==' + req.query[key])
      } else {
        where = where + ';' + key + encodeURIComponent('==') + encodeURIComponent(req.query[key])
      }
      controle = 1
    }
    if (key === 'fantasyName') {
      //pesquisa do campo cliente na finalização do pedido
      //  where = where + ';' + key + '==' + encodeURIComponent(req.query[key])

      //        (nome=='+req.query[key];',apelido=='*${dados.user}*');
      where =
        where +  ';' +
        '(name' +
        encodeURIComponent('==' + req.query[key]) +
        ',' +
        'fantasyName' +
        encodeURIComponent('==' + req.query[key]) + ')'
    }

    if (key === 'concat_cliente') {

      where =
        where +
        '(name' +
        encodeURIComponent('==' + req.query[key]) +
        ',' +
        'fantasyName' +
        encodeURIComponent('==' + req.query[key]) +
        ',' +
        'documentNumber' +
        encodeURIComponent('==' + req.query[key]) +
        ')' +
        ';tags!=' +
        "'inactive'" +
        ';tags!=' +
        "'blocked'"+
        ';tags==' +
        "'customer'" 
    }
  }

  console.log(where)
  req.body.where = where

  const response = await ClientesController.fetchAllClientes(req.body)
  return res.status(response.status).send(response)
})

//Listando todos os clientes
router.get('/noparameters', verifyToken, verifyERPToken, async (req, res) => {
  if (req.query.email) {
    req.body.email = req.query.email
  } else if (req.query.nome) {
    req.body.nome = req.query.nome
  }

  var where = 'q='
  var controle = 0
  for (const key in req.query) {
    if (key !== 'email' && key !== 'fantasyName' && key !== 'apelido' && key !== 'concat_cliente') {
      if (controle == 0) {
        where = where + key + encodeURIComponent('==' + req.query[key])
      } else {
        where = where + ';' + key + encodeURIComponent('==') + encodeURIComponent(req.query[key])
      }
      controle = 1
    }
    if (key === 'fantasyName') {
      //pesquisa do campo cliente na finalização do pedido
      //  where = where + ';' + key + '==' + encodeURIComponent(req.query[key])

      //        (nome=='+req.query[key];',apelido=='*${dados.user}*');
      where =
        where +
        '(name' +
        encodeURIComponent('==' + req.query[key]) +
        ',' +
        'fantasyName' +
        encodeURIComponent('==' + req.query[key]) + ')'
    }

    if (key === 'concat_cliente') {

      where =
        where +
        '(name' +
        encodeURIComponent('==' + req.query[key]) +
        ',' +
        'fantasyName' +
        encodeURIComponent('==' + req.query[key]) +
        ',' +
        'documentNumber' +
        encodeURIComponent('==' + req.query[key]) +
        ')' +
        ';tags!=' +
        "'inactive'" +
        ';tags!=' +
        "'blocked'"+
        ';tags==' +
        "'customer'" 
    }
  }
  req.body.where = where

  const response = await ClientesController.fetchAllClientsWithoutParameters(req.body)
  return res.status(response.status).send(response)
})

//Listando os profiles fiscais
router.get('/perfilfiscal', verifyToken, verifyERPToken, async (req, res) => {
  const response = await ClientesController.fetchtaxProfile(req.body)
  return res.status(response.status).send(response)
})
router.get('/erpclientinfo', verifyToken, verifyERPToken, async (req, res) => {
  req.body.cnpj = req.query.cnpj
  //console.log(req.query);

  const response = await ClientesController.fetchClientErpInfo(req.body)
  return res.status(response.status).send(response)
})

router.get('/endereco/:id', verifyToken, verifyERPToken, async (req, res) => {
  console.log('acessou');
  req.body.id = Number(req.params.id)
  if (req.query.email) {
    req.body.email = req.query.email
  }
  //console.log('entrou aqui'+req.body.email);
  const response = await ClientesController.fetchAddress(req.body)
  return res.status(response.status).send(response)
})

//Listando todos as transportadoras
router.get(
  '/transportadoras',
  verifyToken,
  verifyERPToken,
  async (req, res) => {
    var where = 'q='
    for (const key in req.query) {
      if (key === 'concat_transp') {
        where =
          where +
          '(name' +
          '==' + req.query[key] +
          ',' +
          'fantasyName' +
          '==' + req.query[key] +
          ',' +
          'documentNumber' +
          '==' + req.query[key] +
          ')' +
          ';tags!=' +
          "'inactive'" +
          ';tags!=' +
          "'blocked'"+
          ';tags==' +
          "'shipping'"

      }
    }
    console.log(where)
    req.body.where = where
    const response = await ClientesController.fetchAllTransportadoras(req.body)
    return res.status(response.status).send(response)
  },
)
router.get(
  '/transportadorasByID',
  verifyToken,
  verifyERPToken,
  async (req, res) => {
    var where = 'q='
    for (const key in req.query) {
      if (key === 'concat_transp') {
        where =
          where +
          '(id==' + Number(req.query[key]) + ')' +
          ';tags!=' +
          "'inactive'" +
          ';tags!=' +
          "'blocked'"+
          ';tags==' +
          "'shipping'"

      }
    }
    console.log(where)
    req.body.where = where
    const response = await ClientesController.fetchAllTransportadoras(req.body)
    return res.status(response.status).send(response)
  },
)
//Listando todos as transportadoras
router.get('/transportadorasByClienteId/:id', verifyToken, async (req, res) => {
  req.body.cliente_id = Number(req.params.id)

  const response = await ClientesController.fetchTransportadorasByClienteId(
    req.body,
  )
  return res.status(response.status).send(response)
})

//Listando as informações comerciais
router.get('/infocomerciais', verifyToken, verifyERPToken, async (req, res) => {
  console.log('rota info comercial')
  if (req.query.email) {
    req.body.email = req.query.email
  }
  if (req.query.conta_cliente) {
    req.body.conta_cliente = req.query.conta_cliente
  }
  //console.log('entrou aqui'+req.body.email);
  const response = await ClientesController.fetchInfoComerciais(req.body)
  return res.status(response.status).send(response)
})

//Listando todos os vendedores
router.get('/vendedores', verifyToken, verifyERPToken, async (req, res) => {
  if (req.query.email) {
    req.body.email = req.query.email
  }
  //console.log('entrou aqui'+req.body.email);
  const response = await ClientesController.fetchAllVendedores(req.body)
  return res.status(response.status).send(response)
})
router.get('/endereco/:id', verifyToken, verifyERPToken, async (req, res) => {
  console.log('acessou');
  req.body.id = Number(req.params.id)
  if (req.query.email) {
    req.body.email = req.query.email
  }
  //console.log('entrou aqui'+req.body.email);
  const response = await ClientesController.fetchAddress(req.body)
  return res.status(response.status).send(response)
})

//Listando todos os clientes
router.get('/contasByName', verifyToken, async (req, res) => {
  if (req.query.email) {
    req.body.email = req.query.email
  }
  if (req.query.nome) {
    req.body.nome = req.query.nome
  }

  var where = ''
  for (const key in req.query) {
    if (key !== 'email') {
      where = where + '&' + 's=' + key + '==' + req.query[key]
    }
  }
  req.body.where = where

  const response = await ClientesController.fetchAllClientesByName(req.body)
  return res.status(response.status).send(response)
})

//Lista Clientes por id
router.get('/:id', verifyToken, verifyERPToken, async (req, res) => {
  console.log('obtendo vendedor id ')
  req.body.id = Number(req.params.id)
  console.log(req.body)
  const response = await ClientesController.fetchCliente(req.body)
  console.log(response)
  return res.status(response.status).send(response)
})

//Listando todos os contatos do cliente da API DA PERSONAL
router.get('/:id/contatos', verifyToken, verifyERPToken, async (req, res) => {
  req.body.id = Number(req.params.id)
  console.log(req.body)
  const response = await ClientesController.fetchContatos(req.body)
  return res.status(response.status).send(response)
})

router.get('/:id/arquivos', verifyToken, verifyERPToken, async (req, res) => {
  req.body.id = Number(req.params.id)
  console.log(req.body)
  const response = await ClientesController.fetchFiles(req.body)
  return res.status(response.status).send(response)
})

//Listando todos os contatos do cliente da API DA PERSONAL
router.get('/:id/contatos/:idcontato', verifyToken, async (req, res) => {
  req.body.id = Number(req.params.id)
  req.body.idcontato = Number(req.params.idcontato)

  const response = await ClientesController.fetchContatosById(req.body)
  return res.status(response.status).send(response)
})



//PUT Cliente
router.put('/:id', async (req, res) => {
  req.body.id = Number(req.params.id)

  const response = await ClientesController.updateCliente(req.body)
  return res.status(response.status).send(response)
})

router.delete('/:id/contatos/:idcontato', verifyToken, async (req, res) => {
  req.body.id = Number(req.params.id)
  req.body.idcontato = Number(req.params.idcontato)

  const response = await ClientesController.removeContatos(req.body)
  return res.status(response.status).send(response)
})
module.exports = router
