'use strict';


const {errorResponse} = require('../libs/response');


exports.validatePedidos = body => {
  const bodyStruct = {};
  
  const arr = ['email'];

  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item+'Missing');
    bodyStruct[item] = body[item]
  });

  return bodyStruct;
};
exports.validatePedidosSql = body => {
  const bodyStruct = {};
  
  const arr = ['email','perfil'];

  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item+'Missing');
    bodyStruct[item] = body[item]
  });

  return bodyStruct;
};

exports.validateFetchPedido = body => {
  const bodyStruct = {};
  
  const arr = ['numeroSistema','email' ];

  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item+'Missing');
    bodyStruct[item] = body[item]
  });

  return bodyStruct;
};

exports.validaPedidodeVenda = body => {
 
  const bodyStruct = {};
  const arr = ['email','cliente_id','vendedor_id','prazo_pagamento', 'forma_pagamento', 'emissao', 'empresa_id', 'tipo_frete','observacoes','emails_adicionais','dt_previsao_entrega','transportadora','redespacho']
  const ign_arr = []
  

  arr.map((item) => {
      //Como o pedido é um array de objeto o check fica assim.
            const check = body.hasOwnProperty(item);
            if (!check) throw errorResponse(400, item+'Missing');
            bodyStruct[item] = body[item];
      });
 

  ign_arr.map((item) => {
       bodyStruct[item] = body[item];
     });
  return bodyStruct;
};


/*//validacao de array
exports.validaPedidodeVenda = body => {
 
  const bodyStruct = {};
  const arr = ['email','cliente_id','vendedor_id','prazo_pagamento', 'forma_pagamento', 'emissao', 'empresa_id', 'tipo_frete','observacoes','emails_adicionais','dt_previsao_entrega','transportadora','redespacho']
  const ign_arr = []
  

  arr.map((item) => {
      //Como o pedido é um array de objeto o check fica assim.
      body.forEach(element => {
            const check = element.hasOwnProperty(item);
            if (!check) throw errorResponse(400, item+'Missing');
            bodyStruct[item] = body[item];
      });
  });
 

  ign_arr.map((item) => {
    body.forEach(element => {
       bodyStruct[item] = body[item];
    });
  });
  return bodyStruct;
};

*/


