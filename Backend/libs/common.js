const { errorResponse, successResponse } = require('./response')
const cache = require('./cache')
var jwt = require('jsonwebtoken')
const integracoesController = require('../controllers/integracoes')
const logStruct = (func, error) => {
  return { func: func, file: 'commonLib', error }
}

exports.verifyToken = (req, res, next) => {
  var token = req.headers['x-access-token']
console.log('checando token')
  if (!token) return res.status(402).send(errorResponse(402))

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err) return res.status(402).send(errorResponse(402))

    req.userId = decoded.id

    next()
  })
}

exports.verifyERPToken = async (req, res, next) => {
console.log('verificando token ')
  // var token = req.headers['x-access-token'];
  const response = await integracoesController.getTokenERP()
  if (!response.token) return res.status(402).send(errorResponse(402))

  req.body.token_erp = response.token

  next()
}
