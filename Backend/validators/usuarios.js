'use strict'

const { successResponse, errorResponse } = require('../libs/response')
const { validateEmail, validatePhone } = require('../libs/utilities')

exports.validateUser = (body) => {
  const bodyStruct = {}
  const arr = [
    'nome',
    'senha',
    'email',
    'perfil',
    'conta_id_erp',
    'conta_supervisor_id',
    'empresa_id',
    'conta_gerente_id',
  ]

  if (!body.senha || body.senha.length < 4) {
    throw errorResponse(401, 'shortPassword')
  }

  if (!validateEmail(body.email)) {
    throw errorResponse(401, 'invalidEmail')
  }

  arr.map((item) => {
    const check = body.hasOwnProperty(item)
    if (!check) throw errorResponse(400, item + 'Missing')
    bodyStruct[item] = body[item]
  })

  return bodyStruct
}

exports.validateAuth = (body) => {
  const bodyStruct = {}
  const arr = ['email', 'senha']

  if (!body.senha || body.senha.length < 4) {
    throw errorResponse(401)
  }

  arr.map((item) => {
    const check = body.hasOwnProperty(item)
    if (!check) throw errorResponse(400, item + 'Missing')
    bodyStruct[item] = body[item]
  })

  return bodyStruct
}
