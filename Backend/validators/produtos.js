'use strict';


const {successResponse, errorResponse} = require('../libs/response');

exports.validateCodigo = body => {
  const arr = ['codigo'];

  if (isNaN(body.codigo)) {
    throw errorResponse(401);
  }

  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item + 'Missing');
  });

  return body;
};


exports.validateGetSaldo = body => {
 
  const bodyStruct = {};
  const arr = ['email','empresa_id','tipo_venda'];


  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item+'Missing');
    bodyStruct[item] = body[item]
  });

  return bodyStruct;
};



exports.validateIDProduto = body => {
  const arr = ['id'];

  if (isNaN(body.id)) {
    throw errorResponse(401);
  }

  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item + 'Missing');
  });

  return body;
};

exports.validateClasseCodigo = body => {
  const arr = ['classeCodigo'];

  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item+'Missing');
  });

  return body;
};

exports.validateGrade = body => {
  const arr = ['grade'];


  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item+'Missing');
  });

  return body;
};
exports.validateNome = body => {
  const arr = ['nome'];


  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item+'Missing');
  });

  return body;
};