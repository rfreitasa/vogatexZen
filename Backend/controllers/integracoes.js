const integracoesModel = require('../models/integracoes')
const clientesModel = require('../models/clientes')
const { successResponse, errorResponse } = require('../libs/response')
const { response } = require('express')
const moment = require('moment-timezone')

const logStruct = (func, error) => {
  return { func: func, file: 'bancoERPController', error }
}

/////////////////////ERP TOKEN CONTROL//////////////////////////////////
const getTokenERP = async (reqData) => {
  try {
    //VERIFICA SE HÁ UM TOKEN VALIDO NO BANCO DE DADOS, CASO CONTRÁRIO, SOLICITA AO TMS.
    const responseBD = await integracoesModel.getTokenERPBD()

    if (responseBD.length > 0) {
      return { token: responseBD[0].token }
    }

    const token = await integracoesModel.getTokenERP()
    if (token) {
      
      const new_dt = moment()
        .tz('America/Sao_Paulo')
        .add(12, 'hours')
        .format('YYYY-MM-DD HH:mm:ss')
        

      await integracoesModel.setTokenERPBD(token, new_dt)
 
      return { token }

    } else {
      return errorResponse(402, 'erro refreshtoken')
    }
  } catch (error) {
    console.error('error -> ', logStruct('fetchLogin', error))

    return errorResponse(402, error.message)
  }
}

module.exports = {
  getTokenERP,
}
