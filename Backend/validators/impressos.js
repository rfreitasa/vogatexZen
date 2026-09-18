'use strict';


const {errorResponse} = require('../libs/response');

exports.validaImpressoPedido = body => {
  const bodyStruct = {};
  const arr = ['numero_pedido', 'email'];


  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item+'Missing');
    bodyStruct[item] = body[item]
  });

  return bodyStruct;
};

exports.validaImpressoProduto = body => {
  const bodyStruct = {};
  const arr = ['produto_id'];


  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item+'Missing');
    bodyStruct[item] = body[item]
  });

  return bodyStruct;
};