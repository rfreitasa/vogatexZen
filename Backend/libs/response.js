'use strict';

const errorResponse = (status, message) => {
  let errorResponse;
  switch (status) {
    case 400:
      errorResponse = Object.assign({}, { success: false, status, message: message || 'Faltando parâmetros' });
      break;
    case 401:
      errorResponse = Object.assign({}, { success: false, status, message: message || 'Erro ao criar' });
        break;
    case 402:
      errorResponse = Object.assign({}, { auth: false, success: false, status, message: message || 'Requisição não autorizada' });
      break;
    case 403:
      errorResponse = Object.assign({}, { success: false, status, message: message || 'forbidden' });
      break;
    case 404:
      errorResponse = Object.assign({}, { success: false, status, message: message || 'Não encontrado' });
      break;
    case 500:
        errorResponse = Object.assign({}, { auth: false, success: false, status, message: message || 'Erro de Token' });
        break;
    default:
      errorResponse = Object.assign({}, { success: false, status: status || 520, message: message || 'Erro encontrado na requisição' });
      break;
  }
  return errorResponse;
};

const successResponse = (status, data, meta, message) => {
  let successResponse;
  switch (status) {
    case 201:
      successResponse = Object.assign({}, { success: true, status, message: message || 'criado', data, meta});
      break;
    case 202:
      successResponse = Object.assign({}, { success: true, status, message: message || 'aceito', data, meta });
      break;
    case 204:
      successResponse = Object.assign({}, { success: true, status, message: message || 'alterado', data, meta });
      break;
    default:
      successResponse = Object.assign({}, { success: true, status: status || 200, message: message || 'sucesso', data, meta });
      break;
  }
  return successResponse;
};

module.exports = {
  successResponse,
  errorResponse
}