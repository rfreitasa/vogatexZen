'use strict';


const {errorResponse} = require('../libs/response');


exports.validateCarrinho = body => {
 
    const bodyStruct = {};
    const arr = ['produto_id', 'produto_nome', 'user_email', 'quantidade', 'sub_total']
    const ign_arr = ['status_do_carrinho']
  
    arr.map((item) => {
      const check = body.hasOwnProperty(item);
      if (!check) throw errorResponse(400, item+'Missing');
      bodyStruct[item] = body[item];
    });
  
    ign_arr.map((item) => {
      bodyStruct[item] = body[item];
    });
    return bodyStruct;
  };


exports.validaEmail = body => {
  const bodyStruct = {};
  const arr = ['email' ];

  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item+'Missing');
    bodyStruct[item] = body[item]
  });

  return bodyStruct;
};

exports.validaRemocao = body => {
  const bodyStruct = {};
  const arr = ['id' ];

  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item+'Missing');
    bodyStruct[item] = body[item]
  });

  return bodyStruct;
};

exports.validaRemocaoCarrinho = body => {
  const bodyStruct = {};
  const arr = ['email' ];

  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item+'Missing');
    bodyStruct[item] = body[item]
  });

  return bodyStruct;
};