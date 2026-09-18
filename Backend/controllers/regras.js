const regrasModel = require("../models/regras");
const clientesModel = require("../models/clientes");

const { successResponse, errorResponse } = require("../libs/response");
const {
  validaCadastroregras,
  validaCadastroregrasAtribuidas,
  validaCadastroListaPrecos,
} = require("../validators/regras");
const { validateId } = require("../validators/common");

const logStruct = (func, error) => {
  return { func: func, file: "regrasController", error };
};

const criaRegra = async (reqData) => {
  try {
    //valida se o preenchimento foi realizado corretamente. (campos preenchidos)
    const validInput = validaCadastroregras(reqData);
    const dados_usuario = await clientesModel.getUserInformation(reqData.email);

    if (!dados_usuario[0]) {
      return errorResponse(403, "Dados de usuário não encontrado.");
    } else {
      if (dados_usuario[0].USUARIO_PERFIL === "vendedor") {
        return errorResponse(403, "Permissão inválida para criação de regras.");
      } else {
        //Verifica se a regras ja existe "consulta pelo nome".
        const regrasExists = await regrasModel.getRegraByName(validInput.nome);
        if (regrasExists && regrasExists.length) {
          return errorResponse(403, "regrasExists");
        }

        //cria organização
        const response = await regrasModel.createRegra(validInput);
        return successResponse(
          201,
          response,
          { nome: validInput.nome },
          "regrasCriada"
        );
      }
    }
  } catch (error) {
    console.error("error -> ", logStruct("createregras", error));
    return errorResponse(error.status, error.message);
  }
};

const criaRegraAtribuida = async (reqData) => {
  try {
    console.log(reqData);
    //valida se o preenchimento foi realizado corretamente. (campos preenchidos)
    const validInput = validaCadastroregrasAtribuidas(reqData);
    const dados_usuario = await clientesModel.getUserInformation(reqData.email);

    if (!dados_usuario[0]) {
      return errorResponse(403, "Dados de usuário não encontrado.");
    } else {
      if (dados_usuario[0].USUARIO_PERFIL === "vendedor") {
        return errorResponse(403, "Permissão inválida para criação de regras.");
      } else {
        //Verifica se a regras ja existe "consulta pelo nome".
        const regrasExists = await regrasModel.ExistRegraAtribuida(validInput);
        if (regrasExists && regrasExists.length) {
          return errorResponse(403, "regrasExists");
        }

        //cria organização
        const response = await regrasModel.createRegraAtribuida(validInput);
        return successResponse(
          201,
          response,
          { nome: validInput.nome },
          "regrasCriada"
        );
      }
    }
  } catch (error) {
    console.error("error -> ", logStruct("createregras", error));
    return errorResponse(error.status, error.message);
  }
};

const fetchAllRegras = async (reqData) => {
  try {
    const dados_usuario = await clientesModel.getUserInformation(reqData.email);

    if (!dados_usuario[0]) {
      return errorResponse(403, "Dados de usuário não encontrado.");
    } else {
      const response = await regrasModel.getRegras();
   //   console.log(response);
   return successResponse(200, response);
      
    }
  } catch (error) {
    console.error("error -> ", logStruct("fetchAllOrganizacoes", error));
    return errorResponse(error.status, error.message);
  }
};

const fetchRegra = async (reqData) => {
  try {
    const validInput = validateId(reqData);
    const response = await regrasModel.getRegrasById(validInput.id);

    if (response && !response.length) {
      return errorResponse(404, "regrasNotfound");
    }

    return successResponse(200, response);
  } catch (error) {
    console.error("error -> ", logStruct("fetchregras", error));
    return errorResponse(error.status, error.message);
  }
};

const criaListaPrecos = async (reqData) => {
  try {
    console.log("1");
    //valida se o preenchimento foi realizado corretamente. (campos preenchidos)
    const validInput = validaCadastroListaPrecos(reqData);
    console.log("2");
    //Verifica se a regras ja existe "consulta pelo nome".//solicitado pelo fabiano para permitir cadastro de listas com o mesmo nome , se comissão for diferente
    const listaExists = await regrasModel.checkPricelist(validInput.nome,reqData.LISTA_PRECOS_VALOR_PERMITIDO_INFERIOR_AO_UNITARIO,reqData.LISTA_PRECOS_PERCENTUAL_COMISSAO_DEFAULT);

    if (listaExists && listaExists.length) {
      return errorResponse(403, "listaExists");
    }

    //cria lista
    const response = await regrasModel.createListaPrecos(reqData);
    return successResponse(
      201,
      response,
      { nome: validInput.nome },
      "listaPrecosCriada"
    );
  } catch (error) {
    console.error("error -> ", logStruct("createlistaprecos", error));
    return errorResponse(error.status, error.message);
  }
};

const fetchAllListaPrecos = async (reqData) => {
  try {
    const dados_usuario = await clientesModel.getUserInformation(reqData.email);

    if (!dados_usuario[0]) {
      return errorResponse(403, "Dados de usuário não encontrado.");
    } else {
        const response = await regrasModel.getAllListaPrecos();
        return successResponse(200, response);
    }
  } catch (error) {
    console.error("error -> ", logStruct("fetchAllListaPrecos", error));
    return errorResponse(error.status, error.message);
  }
};

const fetchPriceListByName = async (reqData) => {
  try {
        const response = await regrasModel.getListaPrecosByName(reqData.id);
        return successResponse(200, response);
    
  } catch (error) {
    console.error("error -> ", logStruct("fetchPricelist", error));
    return errorResponse(error.status, error.message);
  }
};


const fetchAllListAttached = async (reqData) => {
  try {
    const dados_usuario = await clientesModel.getUserInformation(reqData.email);

    if (!dados_usuario[0]) {
      return errorResponse(403, "Dados de usuário não encontrado.");
    } else {
        const response = await regrasModel.getAllListAttached(reqData.usuario);
        return successResponse(200, response);
    }
  } catch (error) {
    console.error("error -> ", logStruct("fetchAllListaPrecos", error));
    return errorResponse(error.status, error.message);
  }
};


const fetchAllRegrasAtribuidas = async (reqData) => {
  try {
    const dados_usuario = await clientesModel.getUserInformation(reqData.email);
console.log(dados_usuario)
    if (!dados_usuario[0]) {
      return errorResponse(403, "Dados de usuário não encontrado.");
    } else {
   
        const response = await regrasModel.getRegrasAtribuidas();
        return successResponse(200, response);
   
    }
  } catch (error) {
    console.error("error -> ", logStruct("fetchAllListaPrecos", error));
    return errorResponse(error.status, error.message);
  }
};

const updateListaPrecos = async (reqData) => {
  try {
    const validInput = validateId(reqData);
    const response = await regrasModel.updateListaPrecos(validInput);
    return successResponse(204);
  } catch (error) {
    console.error("error -> ", logStruct("updateListaPrecos", error));
    return errorResponse(error.status, error.message);
  }
};

const updateRegrasAtribuidas = async (reqData) => {
  try {
    console.log(reqData);
    const validInput = validateId(reqData);
    const response = await regrasModel.updateRegraAtribuida(reqData);
    return successResponse(204);
  } catch (error) {
    console.error("error -> ", logStruct("updateRegraAtribuida", error));
    return errorResponse(error.status, error.message);
  }
};

const removeListaPrecos = async (reqData) => {
  try {
    const validInput = validateId(reqData);
    const response = await regrasModel.removeListaPrecos(validInput.id);
    return successResponse(204, null, null, "removido");
  } catch (error) {
    console.error("error -> ", logStruct("removeListaPrecos", error));
    return errorResponse(error.status, error.message);
  }
};

module.exports = {
  criaRegra,
  criaRegraAtribuida,
  fetchAllRegras,
  fetchRegra,
  fetchAllListaPrecos,
  updateListaPrecos,
  updateRegrasAtribuidas,
  criaListaPrecos,
  removeListaPrecos,
  fetchAllRegrasAtribuidas,
  fetchAllListAttached,
  fetchPriceListByName
};
