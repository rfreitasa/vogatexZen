
const organizacaoModel = require('../models/organizacao');
const {successResponse, errorResponse} = require('../libs/response');
const { validaCadastroOrganizacao,validaUpdateOrganizacao } = require('../validators/organizacao');
const { validateId } = require('../validators/common');

const logStruct = (func, error) => {
  return {'func': func, 'file': 'organizacaoController', error}
}

const createOrganizacao = async (reqData) => {
  try {
    //valida se o preenchimento foi realizado corretamente. (campos preenchidos)
    const validInput = validaCadastroOrganizacao(reqData);
    //Verifica se a organizacao ja existe "consulta pelo nome".
    const organizacaoExists = await organizacaoModel.getOrganizacaoByName(validInput.nome);
    if (organizacaoExists && organizacaoExists.length) {
      return errorResponse(403, 'organizacaoExists');
    }

    //cria organização
    const response = await organizacaoModel.createOrganizacao(reqData);
   
    return successResponse(201, response, { nome: validInput.nome}, 'organizacaoCriada')

} catch (error) {
    console.error('error -> ', logStruct('createOrganizacao', error))
    return errorResponse(error.status, error.message);
  }
};
const updateOrganizacao = async (reqData) => {
  try {
    console.log(reqData)
    //valida se o preenchimento foi realizado corretamente. (campos preenchidos)
    const validInput = validaUpdateOrganizacao(reqData);
    //Verifica se a organizacao ja existe "consulta pelo nome".
    const response = await organizacaoModel.updateOrganizacao(validInput);
   
    return successResponse(201, response, { nome: validInput.nome}, 'organizacaoCriada')

} catch (error) {
    console.error('error -> ', logStruct('createOrganizacao', error))
    return errorResponse(error.status, error.message);
  }
};

const fetchAllOrganizacoes = async () => {
    try {
      const response = await organizacaoModel.getOrganizacoes();
      return successResponse(200, response)
    } catch (error) {
      console.error('error -> ', logStruct('fetchAllOrganizacoes', error))
      return errorResponse(error.status, error.message);
    }
  };

const fetchOrganizacao = async (reqData) => {
  try {
    const validInput = validateId(reqData);
    const response = await organizacaoModel.getOrganizacaoById(validInput.id);

    if (response && !response.length) {
        return errorResponse(404, 'organizacaoNotfound');
      }
  

    return successResponse(200, response)
  } catch (error) {
    console.error('error -> ', logStruct('fetchOrganizacao', error))
    return errorResponse(error.status, error.message);
  }
};

module.exports = {
    createOrganizacao,
    updateOrganizacao,
    fetchAllOrganizacoes,
    fetchOrganizacao
  }



