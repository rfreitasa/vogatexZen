
const empresaModel = require('../models/empresa');
const {successResponse, errorResponse} = require('../libs/response');
const { validaCadastroEmpresa } = require('../validators/empresa');
const { validateId } = require('../validators/common');

const logStruct = (func, error) => {
  return {'func': func, 'file': 'empresaController', error}
}

const createEmpresa = async (reqData) => {
  try {
    //valida se o preenchimento foi realizado corretamente. (campos preenchidos)
    const validInput = validaCadastroEmpresa(reqData);
    //Verifica se a empresa ja existe "consulta pelo nome".
    const empresaExists = await empresaModel.getEmpresaByName(validInput.nome);
    if (empresaExists && empresaExists.length) {
      return errorResponse(403, 'empresaExists');
    }

    //cria empresa
    const response = await empresaModel.createEmpresa(validInput);
   
    return successResponse(201, response, { nome: validInput.nome}, 'empresaCriada')

} catch (error) {
    console.error('error -> ', logStruct('createempresa', error))
    return errorResponse(error.status, error.message);
  }
};


const fetchAllEmpresas = async () => {
    try {
      const response = await empresaModel.getEmpresas();
      return successResponse(200, response)
    } catch (error) {
      console.error('error -> ', logStruct('fetchAllEmpresas', error))
      return errorResponse(error.status, error.message);
    }
  };

const fetchEmpresa = async (reqData) => {
  try {
    const validInput = validateId(reqData);
    const response = await empresaModel.getEmpresaById(validInput.id);

    if (response && !response.length) {
        return errorResponse(404, 'empresaNotfound');
      }
  

    return successResponse(200, response)
  } catch (error) {
    console.error('error -> ', logStruct('fetchempresa', error))
    return errorResponse(error.status, error.message);
  }
};

const fetchEmpresaERP = async (reqData) => {
  try {
    const response = await empresaModel.getEmpresaERP();

    if (response && !response.length) {
        return errorResponse(404, 'empresaNotfound');
      }
  

    return successResponse(200, response)
  } catch (error) {
    console.error('error -> ', logStruct('fetchempresa', error))
    return errorResponse(error.status, error.message);
  }
 };
 const updateEmpresa = async (reqData) => {
  try {
    console.log('Atualizando Empresa')
    const response = await empresaModel.updateEmpresa(reqData)
    console.log(response)
    if(response=='ok'){  
    return successResponse(204)
    }
    else{
      return errorResponse('403','ERRO');
    }
  } catch (error) {
    console.error('error -> ', logStruct('updateEmpresa', error))
    return errorResponse(error.status, error.message)
  }
}


 module.exports = {
    createEmpresa,
    fetchAllEmpresas,
    fetchEmpresa,
    fetchEmpresaERP,
    updateEmpresa
 }



