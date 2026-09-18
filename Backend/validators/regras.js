'use strict';


const {errorResponse} = require('../libs/response');

exports.validaCadastroregras = body => {
  const bodyStruct = {};
  const arr = ['nome', 'tipo', 'info' ];


  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item+'Missing');
    bodyStruct[item] = body[item]
  });

  return bodyStruct;
};

exports.validaCadastroregrasAtribuidas = body => {
  const bodyStruct = {};
  const arr = ['REGRAS_ATRIBUIDAS_REGRAS_COMERCIAIS_ID', 'REGRAS_ATRIBUIDAS_EMPRESA_ID', 'REGRAS_ATRIBUIDAS_VALOR',
  'REGRAS_ATRIBUIDAS_LISTA_PRECOS' ];


  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item+'Missing');
    bodyStruct[item] = body[item]
  });

  return bodyStruct;
};


exports.validaCadastroListaPrecos = body => {
  const bodyStruct = {};
  const arr = ['nome', 'descricao'];


  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item+'Missing');
    bodyStruct[item] = body[item]
  });

  return bodyStruct;
};