const campaignModel = require('../models/campaigns')
const { successResponse, errorResponse } = require('../libs/response')
const { validaCadastroCampaigns } = require('../validators/campaigns')
const { validateId } = require('../validators/common')

const logStruct = (func, error) => {
  return { func, file: 'campaignsController', error }
}

// Criar campanha
const createCampaign = async (reqData) => {
  try {
    const validInput = validaCadastroCampaigns(reqData)

    // Verifica duplicidade pelo nome
    const campaignExists = await campaignModel.getCampaignByName(validInput.nome)
    if (campaignExists && campaignExists.length) {
      return errorResponse(403, 'campaignExists')
    }

    const response = await campaignModel.createCampaign(reqData)
    return successResponse(201, response, { nome: validInput.nome }, 'campaignCreated')
  } catch (error) {
    console.error('error -> ', logStruct('createCampaign', error))
    return errorResponse(error.status, error.message)
  }
}

// Listar todas as campanhas
const fetchAllCampaigns = async (reqData) => {
  try {
    const response = await campaignModel.getCampaigns(reqData)
    return successResponse(200, response)
  } catch (error) {
    console.error('error -> ', logStruct('fetchAllCampaigns', error))
    return errorResponse(error.status, error.message)
  }
}
const fetchAllCampaignsActive = async (reqData) => {
  try {
    const response = await campaignModel.getCampaignsActive(reqData)
    return successResponse(200, response)
  } catch (error) {
    console.error('error -> ', logStruct('fetchAllCampaigns', error))
    return errorResponse(error.status, error.message)
  }
}


// Buscar campanha por ID
const getCampaignById = async (id) => {
  try {
    const validInput = validateId({ id })
    const response = await campaignModel.getCampaignById(validInput.id)

    if (!response || !response.length) {
      return errorResponse(404, 'campaignNotFound')
    }

    return successResponse(200, response)
  } catch (error) {
    console.error('error -> ', logStruct('getCampaignById', error))
    return errorResponse(error.status, error.message)
  }
}

// Atualizar campanha
const updateCampaign = async (id, reqData) => {
  try {
    const validInput = validateId({ id })
    const response = await campaignModel.updateCampaign(validInput.id, reqData)

    if (response === 'ok') {
      return successResponse(204)
    } else {
      return errorResponse(403, 'updateError')
    }
  } catch (error) {
    console.error('error -> ', logStruct('updateCampaign', error))
    return errorResponse(error.status, error.message)
  }
}

// Deletar campanha
const deleteCampaign = async (id) => {
  try {
    const validInput = validateId({ id })
    const response = await campaignModel.deleteCampaign(validInput.id)

    if (response === 'ok') {
      return successResponse(204)
    } else {
      return errorResponse(403, 'deleteError')
    }
  } catch (error) {
    console.error('error -> ', logStruct('deleteCampaign', error))
    return errorResponse(error.status, error.message)
  }
}

module.exports = {
  createCampaign,
  fetchAllCampaigns,
  fetchAllCampaignsActive,
  getCampaignById,
  updateCampaign,
  deleteCampaign
}
